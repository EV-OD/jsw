
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { parseFile } from './parser/index.js';
import { generateAS } from './codegen/assembly.js';
import { compileAS } from './compiler/index.js';
import { generateGlueCode } from './codegen/glue.js';
import { removeTypes } from './utils/ast.js';
import { optimizeFunctions } from './optimizer/index.js';
import { parse } from '@babel/parser';
import generate from '@babel/generator';

export default function jswPlugin() {
    let functionsToCompile = [];
    let structsToCompile = [];
    let globalsToCompile = [];
    let lambdasToCompile = [];
    let jsCallbacksToRegister = [];

    async function compile() {
        if (process.env.JSW_SKIP_WASM === '1') {
            console.log('[jsw] Skipping wasm compilation (JSW_SKIP_WASM=1)');
            return;
        }
        const files = await glob('src/**/*.ts', { absolute: true });
        functionsToCompile = [];
        structsToCompile = [];
        globalsToCompile = [];
        lambdasToCompile = [];
        jsCallbacksToRegister = [];

        for (const file of files) {
            const code = fs.readFileSync(file, 'utf-8');
            const { functions, structs, globals, lambdas, jsCallbacks } = parseFile(code);
            functionsToCompile.push(...functions);
            structsToCompile.push(...structs);
            if (globals) globalsToCompile.push(...globals);
            if (lambdas) lambdasToCompile.push(...lambdas);
            if (jsCallbacks) jsCallbacksToRegister.push(...jsCallbacks);
        }

        if (functionsToCompile.length > 0 || structsToCompile.length > 0) {
            optimizeFunctions(functionsToCompile);
            const asCode = generateAS(functionsToCompile, structsToCompile, globalsToCompile, lambdasToCompile);
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
                return generateGlueCode(functionsToCompile, structsToCompile, globalsToCompile, jsCallbacksToRegister);
            }
        },

        transform(code, id) {
            if (!id.endsWith('.ts') || !code.includes('use wasm')) return;
            console.log(`[jsw] Transforming ${id}`);
            
            // We need to strip types for the JS output that Vite expects
            // But we also need to replace the body with the proxy call
            
            const ast = parse(code, { sourceType: 'module', plugins: ['typescript'] });
            let hasWasm = false;

            const transformNode = (node) => {
                if (node.type === 'FunctionDeclaration' || (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration')) {
                    const func = node.type === 'FunctionDeclaration' ? node : node.declaration;
                    
                    let isWasm = false;
                    // Check directives (Babel parser often puts "use strict"-style strings here)
                    if (func.body.directives && func.body.directives.length > 0) {
                        for (const d of func.body.directives) {
                            if (d.value && d.value.value === 'use wasm') {
                                isWasm = true;
                                break;
                            }
                        }
                    }
                    // Check first statement
                    if (!isWasm && func.body.body.length > 0 && 
                        func.body.body[0].type === 'ExpressionStatement' && 
                        func.body.body[0].expression.value === 'use wasm') {
                        isWasm = true;
                    }

                    if (isWasm) {
                        
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
                // Use @babel/generator which handles Babel ASTs correctly
                const cleanAst = removeTypes(ast.program);
                const output = generate.default ? generate.default(cleanAst) : generate(cleanAst); 
                return `
                    import { wasmExports as __jsw_exports } from 'virtual:jsw-wasm';
                    ${output.code}
                `;
            }
        }
    };
}
