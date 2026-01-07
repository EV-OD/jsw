
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

export function optimizeFunctions(functions) {
    const functionMap = new Map();
    for (const func of functions) {
        if (!func || !func.name) {
            console.warn('[optimizeFunctions] skipping function with no name when building map', func && Object.keys(func));
            continue;
        }
        functionMap.set(func.name, func);
    }

    let changed = true;
    let iterations = 0;
    const MAX_ITERATIONS = 3; // Avoid infinite loops

    while (changed && iterations < MAX_ITERATIONS) {
        changed = false;
        iterations++;

        for (const func of functions) {
            if (!func || !func.name) {
                console.warn('[optimizeFunctions] skipping function with no name', func && Object.keys(func));
                continue;
            }
            if (!func.bodyAst) continue;

            // Wrap in a program to allow traversal
            // Clone the body to avoid issues with existing AST references
            const bodyClone = t.cloneNode(func.bodyAst, true);
            
            const mockFile = t.file(t.program([
                t.functionDeclaration(
                    t.identifier(func.name),
                    func.params.map(p => t.identifier(p.name)),
                    bodyClone
                )
            ]));

            traverse.default(mockFile, {
                CallExpression(path) {
                    const callee = path.node.callee;
                    if (!t.isIdentifier(callee)) return;

                    const targetFuncName = callee.name;
                    const targetFunc = functionMap.get(targetFuncName);

                    if (!targetFunc || !targetFunc.bodyAst) return;
                    
                    // Avoid recursion
                    if (targetFuncName === func.name) return;

                    // Perform inlining
                    if (inlineFunction(path, targetFunc)) {
                        changed = true;
                    }
                }
            });
            
            // Update body string after optimization
            func.bodyAst = bodyClone;
            func.body = generate.default(func.bodyAst).code;
        }
    }
}

function inlineFunction(path, targetFunc) {
    try {
        const targetBody = t.cloneNode(targetFunc.bodyAst, true);
        const prefix = `_inline_${targetFunc.name}_${Math.random().toString(36).substr(2, 5)}_`;

        const paramNames = targetFunc.params.map(p => p.name);
        const renameMap = new Map();

        // Identify locals to rename
        traverse.default(t.file(t.program([t.functionDeclaration(t.identifier('temp'), [], targetBody)])), {
            Scope(scopePath) {
                for (const name in scopePath.scope.bindings) {
                    if (!renameMap.has(name)) {
                        renameMap.set(name, prefix + name);
                    }
                }
            },
            Identifier(iPath) {
                 if (paramNames.includes(iPath.node.name)) {
                     renameMap.set(iPath.node.name, prefix + iPath.node.name);
                 }
            }
        });

        // Apply renaming
        traverse.default(t.file(t.program([t.functionDeclaration(t.identifier('temp'), [], targetBody)])), {
            Identifier(iPath) {
                if (renameMap.has(iPath.node.name)) {
                    // Skip object properties
                    if ((t.isMemberExpression(iPath.parent) && iPath.parent.property === iPath.node && !iPath.parent.computed) ||
                        (t.isObjectProperty(iPath.parent) && iPath.parent.key === iPath.node && !iPath.parent.computed)) {
                        return;
                    }
                    iPath.node.name = renameMap.get(iPath.node.name);
                }
            }
        });

        const args = path.node.arguments;
        const statements = [];

        // Assign args to params
        targetFunc.params.forEach((p, i) => {
            if (i < args.length) {
                const paramName = renameMap.get(p.name) || (prefix + p.name);
                statements.push(
                    t.variableDeclaration('let', [
                        t.variableDeclarator(
                            t.identifier(paramName),
                            args[i]
                        )
                    ])
                );
            }
        });

        let returnExpr = null;
        const bodyStatements = [];
        
        // Process body statements
        for (const stmt of targetBody.body) {
            if (t.isReturnStatement(stmt)) {
                if (stmt.argument) {
                    returnExpr = stmt.argument;
                }
                // We assume return is at the end or we just take the value and ignore subsequent code (dead code)
                break; 
            } else {
                bodyStatements.push(stmt);
            }
        }

        statements.push(...bodyStatements);

        const statementParent = path.getStatementParent();
        if (statementParent) {
            statementParent.insertBefore(statements);
            if (returnExpr) {
                path.replaceWith(returnExpr);
            } else {
                path.replaceWith(t.identifier('undefined')); // Or remove if statement
            }
            path.skip(); // Prevent recursive inlining in the same pass
            return true;
        }
    } catch (e) {
        console.error('Inlining failed', e);
        return false;
    }
    return false;
}
