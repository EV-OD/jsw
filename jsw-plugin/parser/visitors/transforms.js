import * as t from '@babel/types';

export function createTransformsVisitor() {
    return {
        CallExpression(path) {
            if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'int') {
                path.node.callee.name = 'i32';
            }
        },
        AssignmentExpression(path) {
            if (t.isMemberExpression(path.node.left) && path.node.left.computed) {
                 // Handle assignment: arr[i] = val -> unchecked(arr[i32(i)] = val)
                 if (t.isCallExpression(path.parent) && t.isIdentifier(path.parent.callee) && path.parent.callee.name === 'unchecked') return;
                 
                 const member = path.node.left;
                 const index = member.property;
                 
                 let newIndex = index;
                 if (!t.isNumericLiteral(index) && !(t.isCallExpression(index) && t.isIdentifier(index.callee) && index.callee.name === 'i32')) {
                     newIndex = t.callExpression(t.identifier('i32'), [index]);
                 }
                 
                 const newMember = t.memberExpression(member.object, newIndex, true);
                 const newAssignment = t.assignmentExpression(path.node.operator, newMember, path.node.right);
                 const uncheckedCall = t.callExpression(t.identifier('unchecked'), [newAssignment]);
                 
                 path.replaceWith(uncheckedCall);
                 path.skip();
            }
        },
        MemberExpression(path) {
            if (!path.node.computed) return;
            // If parent is AssignmentExpression and this is the left side, SKIP (handled by AssignmentExpression visitor)
            if (t.isAssignmentExpression(path.parent) && path.parent.left === path.node) return;
            
            if (t.isCallExpression(path.parent) && t.isIdentifier(path.parent.callee) && path.parent.callee.name === 'unchecked') return;
    
            const index = path.node.property;
            let newIndex = index;
            if (!t.isNumericLiteral(index) && !(t.isCallExpression(index) && t.isIdentifier(index.callee) && index.callee.name === 'i32')) {
                 newIndex = t.callExpression(t.identifier('i32'), [index]);
            }
    
            const newMember = t.memberExpression(path.node.object, newIndex, true);
            const uncheckedCall = t.callExpression(t.identifier('unchecked'), [newMember]);
            
            path.replaceWith(uncheckedCall);
            path.skip();
        }
    };
}
