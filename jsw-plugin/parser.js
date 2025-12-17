
import { parse } from '@babel/parser';
import { generate } from 'astring';

export function parseFile(code) {
    const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript']
    });

    const functions = [];

    const visit = (node) => {
        if (node.type === 'FunctionDeclaration' || (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration')) {
            const func = node.type === 'FunctionDeclaration' ? node : node.declaration;
            
            if (func.body.body.length > 0 && isUseWasm(func.body.body[0])) {
                const name = func.id.name;
                
                // Extract types from TS annotations
                const params = func.params.map(p => {
                    let type = 'f64';
                    if (p.typeAnnotation && p.typeAnnotation.typeAnnotation) {
                        type = mapTsType(p.typeAnnotation.typeAnnotation);
                    }
                    return { name: p.name, type };
                });

                let returnType = 'f64';
                if (func.returnType && func.returnType.typeAnnotation) {
                    returnType = mapTsType(func.returnType.typeAnnotation);
                }

                // Extract body without "use wasm"
                // We need to convert Babel AST to ESTree for astring or just use astring if compatible
                // Babel AST is mostly compatible but has some differences. 
                // For simple function bodies, it might work.
                // However, 'astring' expects ESTree. Babel produces slightly different AST.
                // We might need to strip type annotations before passing to astring.
                
                const bodyNodes = func.body.body.slice(1);
                
                // Quick hack: Remove type annotations from the body nodes to make them ESTree compatible
                // In a real world, we should use a proper transformer or babel-generator
                const cleanBody = removeTypes({ type: 'BlockStatement', body: bodyNodes });
                
                const bodyCode = generate(cleanBody);

                functions.push({
                    name,
                    params,
                    returnType,
                    body: bodyCode
                });
            }
        }
    };

    ast.program.body.forEach(visit);
    return functions;
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
        // Add more mappings as needed
        default: return 'f64';
    }
}

function removeTypes(node) {
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
