import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

export function parseFile(code) {
    const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript']
    });

    const functions = [];
    const structs = [];
    const globals = [];
    const lambdas = [];
    const jsCallbacks = [];
    let lambdaCounter = 0;
    let jsCallbackCounter = 0;

    // Helper to map types
    function mapTsType(tsType) {
        if (!tsType) return 'f64';
        if (t.isTSNumberKeyword(tsType)) return 'f64';
        if (t.isTSStringKeyword(tsType)) return 'string';
        if (t.isTSBooleanKeyword(tsType)) return 'bool';
        if (t.isTSVoidKeyword(tsType)) return 'void';
        if (t.isTSTypeReference(tsType)) {
            if (tsType.typeName.name === 'Array') {
                const param = tsType.typeParameters.params[0];
                return `Array<${mapTsType(param)}>`;
            }
            return tsType.typeName.name;
        }
        if (t.isTSArrayType(tsType)) {
            return `Array<${mapTsType(tsType.elementType)}>`;
        }
        if (t.isTSFunctionType(tsType)) {
            const params = tsType.parameters.map(p => mapTsType(p.typeAnnotation.typeAnnotation)).join(',');
            const ret = mapTsType(tsType.typeAnnotation.typeAnnotation);
            return `Closure<[${params}],${ret}>`; 
        }
        return 'f64';
    }

    // 1. Extract Globals and Structs
    traverse.default(ast, {
        VariableDeclaration(path) {
            if (path.parent.type === 'Program') {
                path.node.declarations.forEach(decl => {
                    if (t.isIdentifier(decl.id) && decl.init) {
                        let type = 'f64';
                        if (decl.id.typeAnnotation) {
                            type = mapTsType(decl.id.typeAnnotation.typeAnnotation);
                        } else if (t.isStringLiteral(decl.init)) {
                            type = 'string';
                        } else if (t.isBooleanLiteral(decl.init)) {
                            type = 'bool';
                        }
                        
                        const value = generate.default(decl.init).code;
                        globals.push({ name: decl.id.name, type, value });
                    }
                });
            }
        },
        TSInterfaceDeclaration(path) {
            const name = path.node.id.name;
            const fields = path.node.body.body.map(prop => ({
                name: prop.key.name,
                type: mapTsType(prop.typeAnnotation.typeAnnotation)
            }));
            structs.push({ name, fields });
        },
        ClassDeclaration(path) {
            const name = path.node.id.name;
            const fields = [];
            let constructorParams = [];
            
            path.node.body.body.forEach(node => {
                if (node.type === 'ClassProperty') {
                     let type = 'f64';
                     if (node.typeAnnotation) {
                         type = mapTsType(node.typeAnnotation.typeAnnotation);
                     }
                     fields.push({
                        name: node.key.name,
                        type: type
                     });
                } else if (node.type === 'ClassMethod' && node.kind === 'constructor') {
                    constructorParams = node.params.map(p => ({
                        name: p.name,
                        type: mapTsType(p.typeAnnotation.typeAnnotation)
                    }));
                }
            });
            if (fields.length > 0) {
                structs.push({ name, fields, constructorParams });
            }
        }
    });

    // 2. Process Functions
    traverse.default(ast, {
        NewExpression(path) {
            if (path.node.callee.name && structs.some(s => s.name === path.node.callee.name)) {
                // Replace `new Class(args)` with object literal for struct initialization
                // But wait, AS supports `new Class(args)` if we define a constructor.
                // Our generated structs have default constructors.
                // We need to map the arguments to fields.
                // This is hard without knowing the constructor signature.
                // BUT, for data classes, we can assume the constructor takes fields in order?
                // Or we can just use object literal syntax in AS?
                // AS supports object literals for classes? No.
                // We need to generate a constructor in AS that takes all fields?
                // Or we can replace `new Rect(x, y, w, h)` with:
                // let r = new Rect(); r.x = x; r.y = y; ...
                
                // Let's update the struct generation to include a constructor!
                // We can find the constructor in the ClassDeclaration.
                // But we need to store it in `structs`.
            }
        },
        FunctionDeclaration(path) {
            if (!isUseWasm(path.node)) return;

            const funcName = path.node.id.name;
            const params = path.node.params.map(p => {
                let type = 'f64';
                let isCallback = false;
                let callbackSignature = null;
                
                if (p.typeAnnotation && p.typeAnnotation.typeAnnotation) {
                    const tsType = p.typeAnnotation.typeAnnotation;
                    if (t.isTSFunctionType(tsType)) {
                        isCallback = true;
                        type = 'u32'; // Callback index
                        callbackSignature = {
                            params: tsType.parameters.map(param => mapTsType(param.typeAnnotation.typeAnnotation)),
                            returnType: mapTsType(tsType.typeAnnotation.typeAnnotation)
                        };
                    } else {
                        type = mapTsType(tsType);
                    }
                }
                return { name: p.name, type, isCallback, callbackSignature };
            });

            let returnType = 'f64';
            let returnSignature = null;

            if (path.node.returnType && path.node.returnType.typeAnnotation) {
                const tsType = path.node.returnType.typeAnnotation;
                if (t.isTSFunctionType(tsType)) {
                    returnType = 'Closure'; // Function ptr or Closure ptr
                    returnSignature = {
                        params: tsType.parameters.map(param => mapTsType(param.typeAnnotation.typeAnnotation)),
                        returnType: mapTsType(tsType.typeAnnotation.typeAnnotation)
                    };
                } else {
                    returnType = mapTsType(tsType.typeAnnotation);
                }
            }

            // Analyze Lambdas
            path.traverse({
                ArrowFunctionExpression(arrowPath) {
                    // Check if this is a JS callback (inside Object, no "use wasm")
                    const isInsideObject = arrowPath.parent.type === 'ObjectProperty';
                    const hasUseWasm = arrowPath.node.body.type === 'BlockStatement' && 
                                     arrowPath.node.body.body.length > 0 && 
                                     isUseWasmStmt(arrowPath.node.body.body[0]);

                    if (isInsideObject && !hasUseWasm) {
                        // Extract as JS Callback
                        const callbackName = `__js_callback_${funcName}_${jsCallbackCounter++}`;
                        const callbackCode = generate.default(arrowPath.node).code;
                        
                        jsCallbacks.push({
                            name: callbackName,
                            code: callbackCode
                        });

                        // Replace with new Closure(index, 0, 1)
                        // We need the index of this callback in the registry.
                        // Since we don't know the runtime index yet, we can't hardcode it easily.
                        // BUT, we can register them in order.
                        // So index = global_callback_count + local_index?
                        // Or we can generate a helper `getJSCallbackIndex("name")`?
                        // Simplest: The glue code will register them in order.
                        // We need to pass the index to Wasm.
                        // We can use a global variable in Wasm that is imported?
                        // Or we can just use a placeholder and let the glue code handle it?
                        // Wait, the Wasm code is generated from this AST.
                        // We need to put a number here.
                        // Let's assume we register them in the order they appear in `jsCallbacks`.
                        // But `jsCallbacks` is per file? Or per compilation?
                        // It's per file here.
                        // We need a global counter across all files?
                        // For now, let's assume one file or handle it in glue.
                        // Actually, we can export a function `__get_js_callback_index(id)` imported from env.
                        // But that's complex.
                        // Let's just use a magic number or string? No, Wasm needs u32.
                        
                        // Better approach:
                        // Generate a global variable in Wasm: `export var __js_callback_index_NAME: u32 = 0;`
                        // In glue code, we set this variable to the real index after registration.
                        // Then here we use `__js_callback_index_NAME`.
                        
                        globals.push({
                            name: `${callbackName}_index`,
                            type: 'u32',
                            value: '0' // Will be updated by glue
                        });
                        
                        arrowPath.replaceWith(
                            t.newExpression(t.identifier('Closure'), [
                                t.identifier(`${callbackName}_index`),
                                t.numericLiteral(0),
                                t.numericLiteral(1) // Type 1 = JS
                            ])
                        );
                        return;
                    }

                    const lambdaName = `__lambda_${funcName}_${lambdaCounter++}`;
                    
                    // Find captures
                    const captures = [];
                    const arrowScope = arrowPath.scope;
                    
                    arrowPath.traverse({
                        Identifier(idPath) {
                            if (idPath.key === 'key' || idPath.key === 'params' || idPath.isDeclaration()) return;
                            
                            const name = idPath.node.name;
                            if (arrowScope.hasBinding(name)) return; 
                            
                            if (path.scope.hasBinding(name)) {
                                if (!captures.find(c => c.name === name)) {
                                    const binding = path.scope.getBinding(name);
                                    let type = 'f64';
                                    
                                    if (binding.path.isVariableDeclarator() && binding.path.node.id.typeAnnotation) {
                                        type = mapTsType(binding.path.node.id.typeAnnotation.typeAnnotation);
                                    } else if (binding.kind === 'param') {
                                        const param = path.node.params.find(p => p.name === name);
                                        if (param && param.typeAnnotation) {
                                            type = mapTsType(param.typeAnnotation.typeAnnotation);
                                        }
                                    }
                                    
                                    captures.push({ name, type });
                                }
                            }
                        }
                    });

                    let lambdaBody = "";
                    if (arrowPath.node.body.type === 'BlockStatement') {
                        lambdaBody = generate.default(arrowPath.node.body).code;
                    } else {
                        lambdaBody = `{ return ${generate.default(arrowPath.node.body).code}; }`;
                    }

                    if (captures.length > 0) {
                        const envName = `__Env_${lambdaName}`;
                        structs.push({ name: envName, fields: captures });
                        
                        const lambdaParams = [
                            { name: '__env', type: envName },
                            ...arrowPath.node.params.map(p => ({
                                name: p.name,
                                type: mapTsType(p.typeAnnotation.typeAnnotation)
                            }))
                        ];
                        
                        captures.forEach(c => {
                            const regex = new RegExp(`\\b${c.name}\\b`, 'g');
                            lambdaBody = lambdaBody.replace(regex, `__env.${c.name}`);
                        });

                        const lambdaReturnType = mapTsType(arrowPath.node.returnType.typeAnnotation);
                        
                        lambdas.push({
                            name: lambdaName,
                            params: lambdaParams,
                            returnType: lambdaReturnType,
                            body: lambdaBody,
                            isClosure: true,
                            envName: envName
                        });

                        // Inject Env creation
                        const statements = [
                            t.variableDeclaration('const', [
                                t.variableDeclarator(
                                    t.identifier('__env'),
                                    t.newExpression(t.identifier(envName), [])
                                )
                            ])
                        ];
                        
                        captures.forEach(c => {
                            statements.push(
                                t.expressionStatement(
                                    t.assignmentExpression(
                                        '=',
                                        t.memberExpression(t.identifier('__env'), t.identifier(c.name)),
                                        t.identifier(c.name)
                                    )
                                )
                            );
                        });
                        
                        arrowPath.getStatementParent().insertBefore(statements);
                        
                        // Replace with new Closure(index, env, 0)
                        arrowPath.replaceWith(
                            t.newExpression(t.identifier('Closure'), [
                                t.memberExpression(t.identifier(lambdaName), t.identifier('index')),
                                t.callExpression(t.identifier('changetype<usize>'), [t.identifier('__env')]),
                                t.numericLiteral(0) // Type 0 = Wasm
                            ])
                        );

                    } else {
                        const lambdaParams = arrowPath.node.params.map(p => ({
                            name: p.name,
                            type: mapTsType(p.typeAnnotation.typeAnnotation)
                        }));
                        const lambdaReturnType = mapTsType(arrowPath.node.returnType.typeAnnotation);
                        
                        lambdas.push({
                            name: lambdaName,
                            params: lambdaParams,
                            returnType: lambdaReturnType,
                            body: lambdaBody,
                            isClosure: false
                        });

                        // Replace with new Closure(index, 0, 0)
                        arrowPath.replaceWith(
                            t.newExpression(t.identifier('Closure'), [
                                t.memberExpression(t.identifier(lambdaName), t.identifier('index')),
                                t.numericLiteral(0),
                                t.numericLiteral(0) // Type 0 = Wasm
                            ])
                        );
                    }
                }
            });

            path.node.body.body = path.node.body.body.filter(n => !isUseWasmStmt(n));
            
            path.traverse({
                CallExpression(callPath) {
                    if (t.isMemberExpression(callPath.node.callee) && 
                        callPath.node.callee.object.name === 'console' && 
                        callPath.node.callee.property.name === 'log') {
                        callPath.node.callee = t.identifier('consoleLog');
                    }
                }
            });
            
            // Transform callback calls
            params.forEach(p => {
                if (p.isCallback) {
                    path.traverse({
                        CallExpression(callPath) {
                            if (t.isIdentifier(callPath.node.callee) && callPath.node.callee.name === p.name) {
                                callPath.node.callee = t.identifier(`__invoke_${p.name}`);
                                callPath.node.arguments.unshift(t.identifier(p.name));
                            }
                        }
                    });
                }
            });

            let body = generate.default(path.node.body).code;

            functions.push({
                name: funcName,
                params,
                returnType,
                returnSignature,
                body
            });
        }
    });

    return { functions, structs, globals, lambdas, jsCallbacks };
}

function isUseWasm(node) {
    return node.body.body.length > 0 && isUseWasmStmt(node.body.body[0]);
}

function isUseWasmStmt(node) {
    return node.type === 'ExpressionStatement' && 
           node.expression.type === 'StringLiteral' && 
           node.expression.value === 'use wasm';
}
