export function removeTypes(node) {
    if (!node) return node;
    
    if (Array.isArray(node)) {
        return node.map(removeTypes).filter(n => n !== null);
    }
    
    if (typeof node === 'object') {
        // Unwrap TS Expressions
        if (node.type === 'TSTypeAssertion' || 
            node.type === 'TSAsExpression' || 
            node.type === 'TSNonNullExpression') {
             return removeTypes(node.expression);
        }

        if (node.type === 'TSParameterProperty') {
             return removeTypes(node.parameter);
        }

        // Remove TS-only statements
        if (node.type === 'TSInterfaceDeclaration' || 
            node.type === 'TSTypeAliasDeclaration' ||
            node.type === 'TSEnumDeclaration' ||
            node.type === 'TSModuleDeclaration') {
            return null;
        }

        const newNode = { ...node };
        
        // Strip type annotations
        delete newNode.typeAnnotation;
        delete newNode.returnType;
        delete newNode.optional;
        delete newNode.declare; // for "declare class" etc
        delete newNode.accessibility; // public/private
        delete newNode.readonly;

        if (newNode.type === 'StringLiteral') {
            // newNode.type = 'Literal'; // Don't convert for Babel Generator
            // newNode.raw = `'${newNode.value}'`;
        }
        if (newNode.type === 'NumericLiteral') {
            // newNode.type = 'Literal';
            // newNode.raw = String(newNode.value);
        }
        if (newNode.type === 'BooleanLiteral') {
            // newNode.type = 'Literal';
            // newNode.raw = String(newNode.value);
        }

        for (const key in newNode) {
            if (key !== 'loc' && key !== 'start' && key !== 'end') {
                if (typeof newNode[key] === 'object' && newNode[key] !== null) {
                    const res = removeTypes(newNode[key]);
                    // If a statement became null, we should probably handle it? 
                    // But for object properties, it's tricky. 
                    // Array recursion handles null filtering.
                    newNode[key] = res;
                }
            }
        }
        return newNode;
    }
    return node;
}
