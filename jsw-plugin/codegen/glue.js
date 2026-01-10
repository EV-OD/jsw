export function generateGlueCode(functionsToCompile, structsToCompile, globals, jsCallbacks) {
    const isStruct = (type) => structsToCompile.some(s => s.name === type);
    const isArray = (type) => type.endsWith('[]');
    const getElemType = (type) => type.slice(0, -2);

    // Helper to generate marshalling code
    const toASType = (t) => {
        if (t.endsWith('[]')) {
            const elem = t.slice(0, -2);
            let mappedElem = elem;
            if (elem === 'number') mappedElem = 'f64';
            if (elem === 'boolean') mappedElem = 'bool';
            if (elem.endsWith('[]')) {
                    return `Array<${toASType(elem)}>`;
            }
            return `Array<${mappedElem}>`;
        }
        return t;
    };

    const toSafeName = (asType) => asType.replace(/[<>]/g, '_');

    // Helper to generate marshalling code
    const generateToWasm = (valExpr, type) => {
        if (type === 'string') return `wasmExports.__newString(${valExpr})`;
        if (type.startsWith('Closure<')) {
             return `__marshal_toWasm_Closure(${valExpr})`;
        }
        if (isStruct(type)) return `__marshal_toWasm_${type}(${valExpr})`;
        if (isArray(type)) {
            const elem = getElemType(type);
            const asType = toASType(type);
            const safeName = toSafeName(asType);
            
            const mapperBody = generateToWasm('v', elem);
            if (mapperBody === 'v') {
                    return `wasmExports.__newArray(wasmExports.__idof_${safeName}(), ${valExpr})`;
            } else {
                    return `wasmExports.__newArray(wasmExports.__idof_${safeName}(), ${valExpr}.map(v => ${mapperBody}))`;
            }
        }
        return valExpr;
    };

    const generateToJS = (valExpr, type) => {
        if (type === 'string') return `wasmExports.__getString(${valExpr})`;
        if (type.startsWith('Closure<')) {
            const match = type.match(/Closure<\[(.*)\],(.*)>/);
            const paramTypes = match[1] ? match[1].split(',') : [];
            const retType = match[2];
            // We pass types as strings to the helper
            return `__marshal_toJS_Closure(${valExpr}, [${paramTypes.map(t=>`'${t}'`).join(',')}], '${retType}')`;
        }
        if (isStruct(type)) return `__marshal_toJS_${type}(${valExpr})`;
        if (isArray(type)) {
            const elem = getElemType(type);
            
            const mapperBody = generateToJS('v', elem);
            if (mapperBody === 'v') {
                return `wasmExports.__getArray(${valExpr})`;
            } else {
                return `wasmExports.__getArray(${valExpr}).map(v => ${mapperBody})`;
            }
        }
        return valExpr;
    };

    // Generate marshalling helpers for structs
    let marshallingHelpers = '';
    for (const struct of structsToCompile) {
        // To Wasm
        marshallingHelpers += `
        function __marshal_toWasm_${struct.name}(obj) {
            const ptr = wasmExports.__new_${struct.name}();
            ${struct.fields.map(f => {
                return `wasmExports.__set_${struct.name}_${f.name}(ptr, ${generateToWasm(`obj.${f.name}`, f.type)});`;
            }).join('\n')}
            return ptr;
        }
        `;

        // To JS
        const isModel = struct.name === 'Model';
        marshallingHelpers += `
        function __marshal_toJS_${struct.name}(ptr) {
            ${isModel ? `
            if (ptr === 0) {
                console.warn('[jsw] Warning: __marshal_toJS_Model called with null pointer');
                // return safe default?
            }` : ''}
            return {
                ${struct.fields.map(f => {
                    return `${f.name}: ${generateToJS(`wasmExports.__get_${struct.name}_${f.name}(ptr)`, f.type)}`;
                }).join(',\n')}
            };
        }
        `;
    }

    // Closure Marshalling Helper
    // We need to generate this dynamically or just once?
    // Since generateToJS calls it with types, we can make it a generic helper in the output.
    // But generateToJS returns a string expression.
    // So we need to define __marshal_toJS_Closure in the output.

    // Generate callback invokers for env
    let envCallbacks = '';
    for (const func of functionsToCompile) {
        for (const p of func.params) {
            if (p.isCallback) {
                const sig = p.callbackSignature;
                const args = sig.params.map((_, i) => `arg${i}`).join(', ');
                
                const marshalledArgs = sig.params.map((t, i) => {
                    let code = generateToJS(`arg${i}`, t);
                    return code.replace(/wasmExports/g, 'module.exports');
                }).join(', ');
                
                const returnConversion = (expr) => {
                    let code = generateToWasm(expr, sig.returnType);
                    return code.replace(/wasmExports/g, 'module.exports');
                };
                
                envCallbacks += `
                __invoke_${p.name}: (fnIndex, ${args}) => {
                    const fn = getCallback(fnIndex);
                    const result = fn(${marshalledArgs});
                    return ${returnConversion('result')};
                },
                `;
            }
        }
    }

    let wrappers = '';
    for (const func of functionsToCompile) {
        const args = func.params.map((p, i) => `arg${i}`).join(', ');
        
        let callArgs = [];
        let prepCode = '';
        
        func.params.forEach((p, i) => {
            const valExpr = `arg${i}`;
            if (p.isCallback) {
                prepCode += `const ptr${i} = registerCallback(${valExpr});\n`;
                callArgs.push(`ptr${i}`);
            } else if (p.type === 'f64' || p.type === 'i32' || p.type === 'bool') {
                callArgs.push(valExpr);
            } else {
                prepCode += `const ptr${i} = ${generateToWasm(valExpr, p.type)};\n`;
                callArgs.push(`ptr${i}`);
            }
        });
        
        let call = `wasmExports.${func.name}(${callArgs.join(', ')})`;
        
        // Simplified return handling
        call = generateToJS(call, func.returnType);
        
        wrappers += `
        export function ${func.name}(${args}) {
            ${prepCode}
            return ${call};
        }
        `;
    }

    return `
        import { instantiate } from '@assemblyscript/loader';

        const callbackRegistry = [];
        function registerCallback(fn) {
            const idx = callbackRegistry.length;
            callbackRegistry.push(fn);
            return idx;
        }
        function getCallback(idx) {
            return callbackRegistry[idx];
        }
        
        console.log('[jsw] Fetching /jsw.wasm...');
        const response = await fetch('/jsw.wasm');
        console.log('[jsw] Fetch response:', response);
        const module = await instantiate(response, {
            env: {
                consoleLog: (ptr) => {
                    const str = typeof ptr === 'number' ? ptr : module.exports.__getString(ptr);
                    console.log(str);
                },
                abort: () => console.log("Abort!"),
                ${envCallbacks}
            }
        });
        const wasmExports = module.exports;

        // Register extracted JS callbacks
        ${jsCallbacks ? jsCallbacks.map(cb => {
            // Need to remove types from callback code if they exist
            // However, cb.code is a string source. We should have stripped types in parser?
            // The parser extracts "raw" code snippet. 
            // We need to use @babel/generator on the AST of the callback to get safe JS.
            // But right now cb.code is likely the raw string from TS source.
            // As a fast fix, let's just assume we can't easily strip types from string here without parsing again.
            // In parser/index.js we should store AST or stripped code.
            return `
        const ${cb.name} = ${cb.code};
        const ${cb.name}_index = registerCallback(${cb.name});
        // Update the global index in Wasm
        if (wasmExports['${cb.name}_index']) {
            // ...
        }`;
        }).join('\n') : ''}
        
        // Fix: We need to set the indices in Wasm.
        // Since we can't easily set exported globals without setters,
        // let's generate setters in assembly.js?
        // Or, we can use a simpler approach:
        // The parser generated 'export var name_index = 0'.
        // We can add 'export function set_name_index(v: u32) { name_index = v; }' in assembly.js
        // But we need to pass that info to assembly.js generator.
        
        // HACK: For now, let's assume we can't set it and see if we can pass it another way.
        // Actually, if we use 'import' for these indices, it would be easier.
        // But we are generating a single Wasm module.
        
        // Let's modify assembly.js generator to add setters for these globals.
        
        function __marshal_toJS_Closure(ptr, paramTypes, retType) {
            const index = wasmExports.__get_Closure_index(ptr);
            const env = wasmExports.__get_Closure_env(ptr);
            const type = wasmExports.__get_Closure_type(ptr);

            if (type === 1) { // JS Callback
                return getCallback(index);
            }
            
            const jsFn = (...args) => {
                // Marshal arguments
                const marshalledArgs = args.map((arg, i) => {
                    if (typeof arg === 'string') return wasmExports.__newString(arg);
                    return arg; // Fallback for primitives
                });

                const fn = wasmExports.table.get(index);
                const res = fn(env, ...marshalledArgs);
                
                if (retType === 'string') return wasmExports.__getString(res);
                return res;
            };
            jsFn._index = index;
            jsFn._env = env;
            jsFn._type = 0;
            return jsFn;
        }

        function __marshal_toWasm_Closure(fn) {
            if (fn._index !== undefined && fn._env !== undefined && fn._type === 0) {
                return wasmExports.__new_Closure(fn._index, fn._env, 0);
            }
            // If it's a registered JS callback?
            // We don't easily know if a random JS function is registered.
            // But if we are passing a JS function into Wasm, we should register it.
            const idx = registerCallback(fn);
            return wasmExports.__new_Closure(idx, 0, 1);
        }

        ${marshallingHelpers}

        ${wrappers}

        export { wasmExports };
    `;
}
