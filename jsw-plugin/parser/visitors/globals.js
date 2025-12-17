import * as t from '@babel/types';
import generate from '@babel/generator';
import { mapTsType } from '../types.js';

export function createGlobalsVisitor(globals) {
    return {
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
        }
    };
}
