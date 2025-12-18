import * as t from '@babel/types';
import generate from '@babel/generator';
import { mapTsType } from '../types.js';
import { transformBodyTypes } from '../utils.js';

export function createStructsVisitor(structs) {
    return {
        TSInterfaceDeclaration(path) {
            const name = path.node.id.name;
            const fields = path.node.body.body.map(prop => ({
                name: prop.key.name,
                type: mapTsType(prop.typeAnnotation ? prop.typeAnnotation.typeAnnotation : null)
            }));
            structs.push({ name, fields });
        },
        ClassDeclaration(path) {
            const name = path.node.id.name;
            const superClass = path.node.superClass ? path.node.superClass.name : null;
            const fields = [];
            const staticFields = [];
            const methods = [];
            const staticMethods = [];
            let constructorParams = [];
            let constructorBody = null;
            
            path.get('body.body').forEach(propPath => {
                const node = propPath.node;
                
                if (node.type === 'ClassProperty') {
                     let type = 'f64';
                     if (node.typeAnnotation) {
                         type = mapTsType(node.typeAnnotation.typeAnnotation);
                     }
                     
                     const field = {
                        name: node.key.name,
                        type: type,
                        value: node.value ? generate.default(node.value).code : null
                     };

                     if (node.static) {
                         staticFields.push(field);
                     } else {
                         fields.push(field);
                     }
                } else if (node.type === 'ClassMethod') {
                    if (node.kind === 'constructor') {
                        constructorParams = node.params.map(p => ({
                            name: p.name,
                            type: mapTsType(p.typeAnnotation ? p.typeAnnotation.typeAnnotation : null)
                        }));
                        
                        transformBodyTypes(propPath.get('body'));
                        constructorBody = generate.default(node.body).code;
                        
                    } else if (node.kind === 'method') {
                        const params = node.params.map(p => ({
                            name: p.name,
                            type: mapTsType(p.typeAnnotation.typeAnnotation)
                        }));
                        const returnType = mapTsType(node.returnType.typeAnnotation);
                        
                        transformBodyTypes(propPath.get('body'));
                        const body = generate.default(node.body).code;
                        
                        const method = {
                            name: node.key.name,
                            params,
                            returnType,
                            body
                        };
                        
                        if (node.static) {
                            staticMethods.push(method);
                        } else {
                            methods.push(method);
                        }
                    }
                }
            });
            
            structs.push({ 
                name, 
                superClass,
                fields, 
                staticFields,
                methods,
                staticMethods,
                constructorParams,
                constructorBody
            });
        }
    };
}
