export function removeTypes(node) {
    if (!node) return node;
    if (Array.isArray(node)) return node.map(removeTypes);
    if (typeof node === 'object') {
        const newNode = { ...node };
        delete newNode.typeAnnotation;
        delete newNode.returnType;
        delete newNode.optional;
        
        // Babel uses StringLiteral for directives, ESTree uses Literal
        if (newNode.type === 'StringLiteral') {
            newNode.type = 'Literal';
            newNode.raw = `'${newNode.value}'`;
        }
        if (newNode.type === 'NumericLiteral') {
            newNode.type = 'Literal';
            newNode.raw = String(newNode.value);
        }
        if (newNode.type === 'BooleanLiteral') {
            newNode.type = 'Literal';
            newNode.raw = String(newNode.value);
        }

        for (const key in newNode) {
            if (key !== 'loc' && key !== 'start' && key !== 'end') {
                newNode[key] = removeTypes(newNode[key]);
            }
        }
        return newNode;
    }
    return node;
}
