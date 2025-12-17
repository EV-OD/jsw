import { mapTsType } from '../types.js';

export function createStructsVisitor(structs) {
    return {
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
    };
}
