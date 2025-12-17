
export function generateGlueCode(functionsToCompile, structsToCompile) {
    const isStruct = (type) => structsToCompile.some(s => s.name === type);
    const isArray = (type) => type.endsWith('[]');
    const getElemType = (type) => type.slice(0, -2);

    // Helper to generate marshalling code
    const toASType = (t) => {
        if (t.endsWith('[]')) {
            const elem = t.slice(0, -2);
            // Map primitive types to AS types if needed, though generator handles most
            let mappedElem = elem;
            if (elem === 'number') mappedElem = 'f64';
            if (elem === 'boolean') mappedElem = 'bool';
            
            // Recursively handle nested arrays
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
        marshallingHelpers += `
        function __marshal_toJS_${struct.name}(ptr) {
            return {
                ${struct.fields.map(f => {
                    return `${f.name}: ${generateToJS(`wasmExports.__get_${struct.name}_${f.name}(ptr)`, f.type)}`;
                }).join(',\n')}
            };
        }
        `;
    }

    let wrappers = '';
    for (const func of functionsToCompile) {
        const args = func.params.map((p, i) => `arg${i}`).join(', ');
        
        let callArgs = [];
        let prepCode = '';
        
        func.params.forEach((p, i) => {
            const valExpr = `arg${i}`;
            if (p.type === 'f64' || p.type === 'i32' || p.type === 'bool') {
                callArgs.push(valExpr);
            } else {
                prepCode += `const ptr${i} = ${generateToWasm(valExpr, p.type)};\n`;
                callArgs.push(`ptr${i}`);
            }
        });
        
        let call = `wasmExports.${func.name}(${callArgs.join(', ')})`;
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
        
        ${marshallingHelpers}

        ${wrappers}
    `;
}
