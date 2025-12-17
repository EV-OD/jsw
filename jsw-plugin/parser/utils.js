import * as t from '@babel/types';
import { mapTsType } from './types.js';

export function isUseWasm(node) {
    return node.body.body.length > 0 && isUseWasmStmt(node.body.body[0]);
}

export function isUseWasmStmt(node) {
    return node.type === 'ExpressionStatement' && 
           node.expression.type === 'StringLiteral' && 
           node.expression.value === 'use wasm';
}

export function transformBodyTypes(path) {
    path.traverse({
        TSTypeReference(typePath) {
            if (typePath.node.typeName.name === 'number') {
                typePath.node.typeName.name = 'f64';
            }
        },
        TSNumberKeyword(typePath) {
            typePath.replaceWith(t.tsTypeReference(t.identifier('f64')));
        },
        TSBooleanKeyword(typePath) {
            typePath.replaceWith(t.tsTypeReference(t.identifier('bool')));
        }
    });
}
