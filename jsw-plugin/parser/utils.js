export function isUseWasm(node) {
    return node.body.body.length > 0 && isUseWasmStmt(node.body.body[0]);
}

export function isUseWasmStmt(node) {
    return node.type === 'ExpressionStatement' && 
           node.expression.type === 'StringLiteral' && 
           node.expression.value === 'use wasm';
}
