
import fs from 'fs';
import path from 'path';
import * as acorn from 'acorn';
import { generate } from 'astring';

const inputFile = process.argv[2] || 'examples/source.js';
const outputDir = 'assembly';
const glueDir = 'build/glue';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(glueDir)) fs.mkdirSync(glueDir, { recursive: true });

const code = fs.readFileSync(inputFile, 'utf-8');

const ast = acorn.parse(code, {
    sourceType: 'module',
    ecmaVersion: 2020
});

const functionsToCompile = [];

function isUseWasm(node) {
    return node.type === 'ExpressionStatement' && 
           node.expression.type === 'Literal' && 
           node.expression.value === 'use wasm';
}

function visit(node) {
    if (node.type === 'FunctionDeclaration') {
        if (node.body.body.length > 0 && isUseWasm(node.body.body[0])) {
            functionsToCompile.push(node);
        }
    } else if (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration') {
        const func = node.declaration;
        if (func.body.body.length > 0 && isUseWasm(func.body.body[0])) {
            functionsToCompile.push(func);
        }
    }
}

ast.body.forEach(visit);

console.log(`Found ${functionsToCompile.length} functions to compile.`);

let asCode = `// Auto-generated AssemblyScript code\n\n`;

functionsToCompile.forEach(func => {
    const name = func.id.name;
    const params = func.params.map(p => `${p.name}: f64`).join(', ');
    // Simple return type assumption
    const returnType = 'f64'; 
    
    // Lowering body
    // We need to remove the "use wasm" directive
    const bodyNodes = func.body.body.slice(1);
    
    // We need to transform JS AST to AS code. 
    // For this POC, we'll use astring to generate JS and assume it's valid AS for simple cases.
    // In a real compiler, we'd map AST nodes to AS AST or string.
    
    // We need to handle 'return' statements and binary expressions.
    // AS is strict about types. JS 'a + b' might need casting if not inferred.
    // But for 'f64', it's mostly compatible.
    
    const bodyCode = generate({
        type: 'BlockStatement',
        body: bodyNodes
    });
    
    asCode += `export function ${name}(${params}): ${returnType} ${bodyCode}\n\n`;
});

fs.writeFileSync(path.join(outputDir, 'generated.ts'), asCode);
console.log(`Generated ${path.join(outputDir, 'generated.ts')}`);

// Generate Glue Code
import { execSync } from 'child_process';

// Compile AS to Wasm
console.log('Compiling AssemblyScript to Wasm...');
try {
    execSync('npx asc assembly/generated.ts --target release --outFile build/release.wasm', { stdio: 'inherit' });
} catch (e) {
    console.error('Failed to compile AssemblyScript');
    process.exit(1);
}

// Rewrite JS AST to use Wasm
// We need to inject the Wasm loader at the top
// And replace function bodies

// 1. Inject import
// We'll assume a simple node environment for now using fs and @assemblyscript/loader
// In a browser, this would be fetch + WebAssembly.instantiate

const glueHeader = `
import fs from 'fs';
import loader from '@assemblyscript/loader';
const wasmModule = await loader.instantiate(fs.readFileSync('./build/release.wasm'));
const wasmExports = wasmModule.exports;
`;

// We need to modify the AST. 
// Since we are iterating, we can modify the nodes in place or rebuild.
// We'll rebuild using astring.

// We need to insert the glue header. 
// AST doesn't easily support "insert raw string", so we'll prepend it to the generated code.

// Transform the AST
function transform(node) {
    if (node.type === 'FunctionDeclaration' || (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration')) {
        const func = node.type === 'FunctionDeclaration' ? node : node.declaration;
        if (func.body.body.length > 0 && isUseWasm(func.body.body[0])) {
            const name = func.id.name;
            // Replace body with return wasmExports.name(...args)
            
            // Construct new body AST
            const newBody = {
                type: 'BlockStatement',
                body: [{
                    type: 'ReturnStatement',
                    argument: {
                        type: 'CallExpression',
                        callee: {
                            type: 'MemberExpression',
                            object: { type: 'Identifier', name: 'wasmExports' },
                            property: { type: 'Identifier', name: name },
                            computed: false
                        },
                        arguments: func.params
                    }
                }]
            };
            
            func.body = newBody;
        }
    }
}

ast.body.forEach(transform);

const generatedJS = generate(ast);
const finalJS = glueHeader + generatedJS;

fs.writeFileSync('examples/source.compiled.js', finalJS);
console.log('Generated examples/source.compiled.js');

