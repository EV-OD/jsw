import * as t from '@babel/types';

export function createTransformsVisitor() {
    return {
        CallExpression(path) {
            if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'int') {
                // Transform int(x) -> i32(x)
                // We can't easily generate AS AST, but we can replace the name?
                // But 'i32' is not a valid JS identifier for a function call usually?
                // Actually, in the generator, we just print the name.
                // So replacing 'int' with 'i32' works if we assume the output is AS.
                path.node.callee.name = 'i32';
            }
        }
    };
}
