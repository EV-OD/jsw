import * as t from '@babel/types';
import generate from '@babel/generator';
import { mapTsType } from '../types.js';
import { isUseWasm, isUseWasmStmt, transformBodyTypes } from '../utils.js';
import { processLambdas } from './lambdas.js';

export function createFunctionsVisitor(state) {
    return {
        FunctionDeclaration(path) {
            if (!isUseWasm(path.node)) return;

            const funcName = path.node.id.name;
            
            // Transform body types first so analysis sees AS types
            transformBodyTypes(path.get('body'));

            let params;
            try {
                params = path.node.params.map((p, idx) => {
                    let type = 'f64';
                    let isCallback = false;
                    let callbackSignature = null;

                    // Safely derive a parameter name. Handle Identifier, AssignmentPattern, RestElement, and others.
                    let paramName = null;
                    if (p && p.type === 'Identifier') paramName = p.name;
                    else if (p && p.type === 'AssignmentPattern' && p.left && p.left.type === 'Identifier') paramName = p.left.name;
                    else if (p && p.type === 'RestElement' && p.argument && p.argument.type === 'Identifier') paramName = p.argument.name;
                    else paramName = `arg${idx}`;

                    if (p.typeAnnotation && p.typeAnnotation.typeAnnotation) {
                        const tsType = p.typeAnnotation.typeAnnotation;
                        if (t.isTSFunctionType(tsType)) {
                            isCallback = true;
                            type = 'u32'; // Callback index
                            callbackSignature = {
                                params: tsType.parameters.map(param => mapTsType(param.typeAnnotation ? param.typeAnnotation.typeAnnotation : null)),
                                returnType: mapTsType(tsType.typeAnnotation ? tsType.typeAnnotation.typeAnnotation : null)
                            };
                        } else {
                            type = mapTsType(tsType);
                        }
                    }
                    return { name: paramName, type, isCallback, callbackSignature };
                });
            } catch (e) {
                console.error(`Error processing params for function ${funcName}:`, e);
                throw e;
            }

            let returnType = 'f64';
            let returnSignature = null;

            try {
                if (path.node.returnType && path.node.returnType.typeAnnotation) {
                    const tsType = path.node.returnType.typeAnnotation;
                    if (t.isTSFunctionType(tsType)) {
                        returnType = 'Closure'; // Function ptr or Closure ptr
                        returnSignature = {
                            params: tsType.parameters.map(param => mapTsType(param.typeAnnotation ? param.typeAnnotation.typeAnnotation : null)),
                            returnType: mapTsType(tsType.typeAnnotation ? tsType.typeAnnotation.typeAnnotation : null)
                        };
                    } else {
                        returnType = mapTsType(tsType);
                    }
                }
            } catch (e) {
                console.error(`Error processing return type for function ${funcName}:`, e);
                throw e;
            }

            // Analyze Lambdas
            try {
                processLambdas(path, state, funcName);
            } catch (e) {
                console.error(`Error processing lambdas for function ${funcName}:`, e);
                throw e;
            }

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
            let bodyAst = path.node.body;

            state.functions.push({
                name: funcName,
                params,
                returnType,
                returnSignature,
                body,
                bodyAst
            });
        }
    };
}
