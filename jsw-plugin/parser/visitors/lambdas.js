import * as t from '@babel/types';
import generate from '@babel/generator';
import { mapTsType } from '../types.js';
import { isUseWasmStmt } from '../utils.js';

export function processLambdas(path, state, funcName) {
    path.traverse({
        ArrowFunctionExpression(arrowPath) {
            // Check if this is a JS callback (inside Object, no "use wasm")
            const isInsideObject = arrowPath.parent.type === 'ObjectProperty';
            const hasUseWasm = arrowPath.node.body.type === 'BlockStatement' && 
                             arrowPath.node.body.body.length > 0 && 
                             isUseWasmStmt(arrowPath.node.body.body[0]);

            if (isInsideObject && !hasUseWasm) {
                // Extract as JS Callback
                const callbackName = `__js_callback_${funcName}_${state.jsCallbackCounter++}`;
                const callbackCode = generate.default(arrowPath.node).code;
                
                state.jsCallbacks.push({
                    name: callbackName,
                    code: callbackCode
                });

                state.globals.push({
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

            const lambdaName = `__lambda_${funcName}_${state.lambdaCounter++}`;
            
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
                state.structs.push({ name: envName, fields: captures });
                
                const lambdaParams = [
                    { name: '__env', type: envName },
                    ...arrowPath.node.params.map(p => ({
                        name: p.name,
                        type: mapTsType(p.typeAnnotation ? p.typeAnnotation.typeAnnotation : null)
                    }))
                ];
                
                captures.forEach(c => {
                    const regex = new RegExp(`\\b${c.name}\\b`, 'g');
                    lambdaBody = lambdaBody.replace(regex, `__env.${c.name}`);
                });

                const lambdaReturnType = mapTsType(arrowPath.node.returnType ? arrowPath.node.returnType.typeAnnotation : null);
                
                state.lambdas.push({
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
                    type: mapTsType(p.typeAnnotation ? p.typeAnnotation.typeAnnotation : null)
                }));
                const lambdaReturnType = mapTsType(arrowPath.node.returnType ? arrowPath.node.returnType.typeAnnotation : null);
                
                state.lambdas.push({
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
}
