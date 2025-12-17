
import { parse } from '@babel/parser';
import { generate } from 'astring';

export function parseFile(code) {
    const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript']
    });

    const functions = [];
    const structs = [];

    const visit = (node) => {
        if (node.type === 'TSInterfaceDeclaration' || (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'TSInterfaceDeclaration')) {
            const iface = node.type === 'TSInterfaceDeclaration' ? node : node.declaration;
            const name = iface.id.name;
            const fields = [];
            
            iface.body.body.forEach(prop => {
                if (prop.type === 'TSPropertySignature') {
                    const fieldName = prop.key.name;
                    const fieldType = mapTsType(prop.typeAnnotation.typeAnnotation);
                    fields.push({ name: fieldName, type: fieldType });
                }
            });
            
            structs.push({ name, fields });
        }
        else if (node.type === 'FunctionDeclaration' || (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration')) {
            const func = node.type === 'FunctionDeclaration' ? node : node.declaration;
            
            if (func.body.body.length > 0 && isUseWasm(func.body.body[0])) {
                const name = func.id.name;
                
                // Extract types from TS annotations
                const params = func.params.map(p => {
                    let type = 'f64';
                    let isCallback = false;
                    let callbackSignature = null;

                    if (p.typeAnnotation && p.typeAnnotation.typeAnnotation) {
                        const tsType = p.typeAnnotation.typeAnnotation;
                        if (tsType.type === 'TSFunctionType') {
                            isCallback = true;
                            type = 'u32'; // AS type
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
                if (func.returnType && func.returnType.typeAnnotation) {
                    const tsType = func.returnType.typeAnnotation;
                    if (tsType.type === 'TSFunctionType') {
                        returnType = 'u32'; // AS type
                        returnSignature = {
                            params: tsType.parameters.map(param => mapTsType(param.typeAnnotation.typeAnnotation)),
                            returnType: mapTsType(tsType.typeAnnotation.typeAnnotation)
                        };
                    } else {
                        returnType = mapTsType(tsType.typeAnnotation);
                    }
                }

                                // Extract body source directly to preserve types
                const bodyStart = func.body.start;
                const bodyEnd = func.body.end;
                let bodySource = code.slice(bodyStart, bodyEnd);

                // Remove "use wasm"
                const useWasmNode = func.body.body[0];
                // Calculate relative positions
                const relativeStart = useWasmNode.start - bodyStart;
                const relativeEnd = useWasmNode.end - bodyStart;
                
                // Replace "use wasm" with spaces to preserve formatting/line numbers, or just remove
                // We need to be careful not to break the block structure
                const before = bodySource.slice(0, relativeStart);
                const after = bodySource.slice(relativeEnd);
                
                // Check for trailing semicolon or newline in the gap?
                // Usually "use wasm"; 
                // We can just replace the content with comments or whitespace
                bodySource = before + "/* use wasm removed */" + after;

                // Replace console.log with consoleLog for AS compatibility
                bodySource = bodySource.replace(/console\.log\s*\(/g, 'consoleLog(');

                // Transform callback calls
                params.forEach(p => {
                    if (p.isCallback) {
                        // Replace `cb(` with `__invoke_cb(cb, `
                        // Use regex with word boundary to avoid replacing partial matches
                        const regex = new RegExp(`\\b${p.name}\\s*\\(`, 'g');
                        bodySource = bodySource.replace(regex, `__invoke_${p.name}(${p.name}, `);
                    }
                });

                functions.push({
                    name,
                    params,
                    returnType,
                    returnSignature,
                    body: bodySource
                });
            }
        }
    };

    ast.program.body.forEach(visit);
    return { functions, structs };
}

function isUseWasm(node) {
    return node.type === 'ExpressionStatement' && 
           node.expression.type === 'StringLiteral' && 
           node.expression.value === 'use wasm';
}

function mapTsType(tsType) {
    switch (tsType.type) {
        case 'TSNumberKeyword': return 'f64';
        case 'TSStringKeyword': return 'string';
        case 'TSBooleanKeyword': return 'bool';
        case 'TSVoidKeyword': return 'void';
        case 'TSArrayType': {
            const elementType = mapTsType(tsType.elementType);
            return `${elementType}[]`; 
        }
        case 'TSTypeReference': {
            // Handle Array<T> syntax
            if (tsType.typeName.name === 'Array' && tsType.typeParameters && tsType.typeParameters.params.length > 0) {
                const elementType = mapTsType(tsType.typeParameters.params[0]);
                return `${elementType}[]`;
            }
            // Handle TypedArrays
            if (['Int32Array', 'Float64Array', 'Uint8Array'].includes(tsType.typeName.name)) {
                return tsType.typeName.name;
            }
            // Handle custom types (structs)
            return tsType.typeName.name;
        }
        default: return 'f64';
    }
}

