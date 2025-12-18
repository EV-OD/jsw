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
                params = path.node.params.map(p => {
                    let type = 'f64';
                    let isCallback = false;
                    let callbackSignature = null;
                    
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
                    return { name: p.name, type, isCallback, callbackSignature };
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
