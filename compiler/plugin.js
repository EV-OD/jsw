
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import * as acorn from 'acorn';
import { generate } from 'astring';
import { execSync } from 'child_process';

export default function jswPlugin() {
    let wasmGenerated = false;
    const functionsToCompile = new Map(); // name -> { code, params, returnType, paramTypes }

    // Helper to parse JSDoc
    function parseJSDoc(comments) {
        const types = { params: {}, returnType: 'f64' };
        if (!comments) return types;

        for (const comment of comments) {
            if (comment.type === 'Block' && comment.value.startsWith('*')) {
                const lines = comment.value.split('\n');
                for (const line of lines) {
                    const paramMatch = line.match(/@param\s+\{(\w+)\}\s+(\w+)/);
                    if (paramMatch) {
                        types.params[paramMatch[2]] = mapType(paramMatch[1]);
                    }
                    const returnMatch = line.match(/@return\s+\{(\w+)\}/) || line.match(/@returns\s+\{(\w+)\}/);
                    if (returnMatch) {
                        types.returnType = mapType(returnMatch[1]);
                    }
                }
            }
        }
        return types;
    }

    function mapType(jsType) {
        switch (jsType.toLowerCase()) {
            case 'number': return 'f64';
            case 'int': 
            case 'integer': return 'i32';
            case 'boolean': return 'bool';
            case 'string': return 'string';
            case 'void': return 'void';
            default: return 'f64';
        }
    }

    async function compile() {
        // 1. Scan src for "use wasm"
        const files = await glob('src/**/*.js', { absolute: true });
        functionsToCompile.clear();

        for (const file of files) {
            const code = fs.readFileSync(file, 'utf-8');
            const comments = [];
            const ast = acorn.parse(code, { 
                sourceType: 'module', 
                ecmaVersion: 2020,
                onComment: comments 
            });

            const visit = (node) => {
                if (node.type === 'FunctionDeclaration' || (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration')) {
                    const func = node.type === 'FunctionDeclaration' ? node : node.declaration;
                    if (func.body.body.length > 0 && isUseWasm(func.body.body[0])) {
                        const name = func.id.name;
                        
                        // Find associated JSDoc
                        // We look for comments ending just before the function start
                        const relevantComments = comments.filter(c => c.end <= func.start && c.end > func.start - 100); // Heuristic
                        const types = parseJSDoc(relevantComments);

                        // Extract body without "use wasm"
                        const bodyNodes = func.body.body.slice(1);
                        
                        // Transform console.log to consoleLog
                        const transformBody = (n) => {
                            if (n.type === 'CallExpression' && 
                                n.callee.type === 'MemberExpression' && 
                                n.callee.object.name === 'console' && 
                                n.callee.property.name === 'log') {
                                n.callee = { type: 'Identifier', name: 'consoleLog' };
                            }
                            for (const key in n) {
                                if (n[key] && typeof n[key] === 'object') {
                                    if (Array.isArray(n[key])) {
                                        n[key].forEach(transformBody);
                                    } else {
                                        transformBody(n[key]);
                                    }
                                }
                            }
                        };
                        bodyNodes.forEach(transformBody);

                        const bodyCode = generate({ type: 'BlockStatement', body: bodyNodes });
                        
                        const params = func.params.map(p => {
                            const type = types.params[p.name] || 'f64';
                            return `${p.name}: ${type}`;
                        }).join(', ');
                        
                        functionsToCompile.set(name, {
                            params,
                            body: bodyCode,
                            returnType: types.returnType,
                            paramTypes: func.params.map(p => types.params[p.name] || 'f64')
                        });
                    }
                }
            };
            
            ast.body.forEach(visit);
        }

        // 2. Generate AssemblyScript
        if (functionsToCompile.size > 0) {
            let asCode = `// Auto-generated by jsw
@external("env", "consoleLog")
declare function consoleLog(s: string): void;

`;
            for (const [name, data] of functionsToCompile) {
                asCode += `export function ${name}(${data.params}): ${data.returnType} ${data.body}\n\n`;
            }
            
            if (!fs.existsSync('assembly')) fs.mkdirSync('assembly');
            fs.writeFileSync('assembly/generated.ts', asCode);
            
            // 3. Compile to Wasm
            console.log('[jsw] Compiling to Wasm...');
            try {
                // Ensure public dir exists
                if (!fs.existsSync('public')) fs.mkdirSync('public');
                // Use local asc binary to avoid npx overhead and potential loops
                const ascPath = path.resolve('node_modules/.bin/asc');
                execSync(`${ascPath} assembly/generated.ts --target release --outFile public/jsw.wasm`, { stdio: 'inherit' });
                wasmGenerated = true;
            } catch (e) {
                console.error('[jsw] Compilation failed', e);
            }
        }
    }

    return {
        name: 'vite-plugin-jsw',
        
        async buildStart() {
            await compile();
        },

        async handleHotUpdate({ file, server }) {
            // Only trigger if the file is in the src directory and is a JS file
            if (file.endsWith('.js') && file.includes('/src/')) {
                console.log(`[jsw] File changed: ${file}`);
                await compile();
                server.ws.send({
                    type: 'full-reload',
                    path: '*'
                });
                // Return empty array to disable default HMR for this update since we did a full reload
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
                // Runtime helper to load the Wasm
                // We generate wrappers for each function to handle string marshalling
                
                let wrappers = '';
                for (const [name, data] of functionsToCompile) {
                    const args = data.paramTypes.map((_, i) => `arg${i}`).join(', ');
                    
                    // Marshalling logic
                    let callArgs = [];
                    let prepCode = '';
                    
                    data.paramTypes.forEach((type, i) => {
                        if (type === 'string') {
                            prepCode += `const ptr${i} = wasmExports.__newString(arg${i});\n`;
                            callArgs.push(`ptr${i}`);
                        } else {
                            callArgs.push(`arg${i}`);
                        }
                    });
                    
                    let call = `wasmExports.${name}(${callArgs.join(', ')})`;
                    
                    if (data.returnType === 'string') {
                        call = `wasmExports.__getString(${call})`;
                    }
                    
                    wrappers += `
                    export function ${name}(${args}) {
                        ${prepCode}
                        return ${call};
                    }
                    `;
                }

                return `
                    import { instantiate } from '@assemblyscript/loader';
                    
                    const response = await fetch('/jsw.wasm');
                    const module = await instantiate(response, {
                        env: {
                            consoleLog: (ptr) => {
                                const str = module.exports.__getString(ptr);
                                console.log(str);
                            },
                            abort: () => console.log("Abort!")
                        }
                    });
                    const wasmExports = module.exports;
                    
                    ${wrappers}
                `;
            }
        },

        transform(code, id) {
            if (!id.endsWith('.js') || !code.includes('use wasm')) return;

            const ast = acorn.parse(code, { sourceType: 'module', ecmaVersion: 2020 });
            let hasWasm = false;

            // We need to inject the import if we find any wasm function
            // But imports must be at top level.
            
            // Strategy: Replace function bodies with calls to virtual module
            // And prepend the import.

            const transformNode = (node) => {
                if (node.type === 'FunctionDeclaration' || (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration')) {
                    const func = node.type === 'FunctionDeclaration' ? node : node.declaration;
                    if (func.body.body.length > 0 && isUseWasm(func.body.body[0])) {
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

            ast.body.forEach(transformNode);

            if (hasWasm) {
                const generated = generate(ast);
                return `
                    import { wasmExports as __jsw_exports } from 'virtual:jsw-wasm';
                    ${generated}
                `;
            }
        }
    };
}

function isUseWasm(node) {
    return node.type === 'ExpressionStatement' && 
           node.expression.type === 'Literal' && 
           node.expression.value === 'use wasm';
}
