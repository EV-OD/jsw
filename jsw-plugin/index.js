
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { parseFile } from './parser.js';
import { generateAS } from './generator.js';
import { compileAS } from './compiler.js';
import { generateGlueCode } from './marshaller.js';
import { parse } from '@babel/parser';
import { generate } from 'astring';

export default function jswPlugin() {
    let functionsToCompile = [];
    let structsToCompile = [];

    async function compile() {
        const files = await glob('src/**/*.ts', { absolute: true });
        functionsToCompile = [];
        structsToCompile = [];

        for (const file of files) {
            const code = fs.readFileSync(file, 'utf-8');
            const { functions, structs } = parseFile(code);
            functionsToCompile.push(...functions);
            structsToCompile.push(...structs);
        }

        if (functionsToCompile.length > 0 || structsToCompile.length > 0) {
            const asCode = generateAS(functionsToCompile, structsToCompile);
            compileAS(asCode);
        }
    }

    return {
        name: 'vite-plugin-jsw',
        
        async buildStart() {
            await compile();
        },

        async handleHotUpdate({ file, server }) {
            if (file.endsWith('.ts') && file.includes('/src/')) {
                console.log(`[jsw] File changed: ${file}`);
                await compile();
                server.ws.send({
                    type: 'full-reload',
                    path: '*'
                });
                return [];
            }
        },

        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url === '/jsw.wasm') {
                    const wasmPath = path.resolve('public/jsw.wasm');
                    if (fs.existsSync(wasmPath)) {
                        const content = fs.readFileSync(wasmPath);
                        res.setHeader('Content-Type', 'application/wasm');
                        res.end(content);
                        return;
                    }
                }
                next();
            });
        },

        resolveId(id) {
            if (id === 'virtual:jsw-wasm') {
                return '\0virtual:jsw-wasm';
            }
        },

        load(id) {
            if (id === '\0virtual:jsw-wasm') {
                return generateGlueCode(functionsToCompile, structsToCompile);
            }
        },

        transform(code, id) {
            if (!id.endsWith('.ts') || !code.includes('use wasm')) return;

            // We need to strip types for the JS output that Vite expects
            // But we also need to replace the body with the proxy call
            
            const ast = parse(code, { sourceType: 'module', plugins: ['typescript'] });
            let hasWasm = false;

            const transformNode = (node) => {
                if (node.type === 'FunctionDeclaration' || (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration')) {
                    const func = node.type === 'FunctionDeclaration' ? node : node.declaration;
                    
                    if (func.body.body.length > 0 && 
                        func.body.body[0].type === 'ExpressionStatement' && 
                        func.body.body[0].expression.value === 'use wasm') {
                        
                        hasWasm = true;
                        const name = func.id.name;
                        
                        // Replace body
                        func.body = {
                            type: 'BlockStatement',
                            body: [{
                                type: 'ReturnStatement',
                                argument: {
                                    type: 'CallExpression',
                                    callee: {
                                        type: 'MemberExpression',
                                        object: { type: 'Identifier', name: '__jsw_exports' },
                                        property: { type: 'Identifier', name: name },
                                        computed: false
                                    },
                                    arguments: func.params
                                }
                            }]
                        };
                    }
                }
            };

            ast.program.body.forEach(transformNode);

            if (hasWasm) {
                // We need to remove types before generating JS
                const cleanAst = removeTypes(ast.program);
                const generated = generate(cleanAst);
                return `
                    import { wasmExports as __jsw_exports } from 'virtual:jsw-wasm';
                    ${generated}
                `;
            }
        }
    };
}

// Duplicate helper from parser.js because of module scope
function removeTypes(node) {
    if (!node) return node;
    if (Array.isArray(node)) return node.map(removeTypes);
    if (typeof node === 'object') {
        const newNode = { ...node };
        delete newNode.typeAnnotation;
        delete newNode.returnType;
        delete newNode.optional;
        
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
