
import { PREAMBLE } from './assembly/preamble.js';
import { createTypeMapper } from './assembly/types.js';
import { generateGlobals } from './assembly/globals.js';
import { generateStructs } from './assembly/structs.js';
import { generateLambdas } from './assembly/lambdas.js';
import { generateFunctions } from './assembly/functions.js';

export function generateAS(functions, structs, globals, lambdas) {
    let code = PREAMBLE;

    const arrayTypes = new Set();
    const mapType = createTypeMapper(arrayTypes);

    code += generateGlobals(globals);
    code += generateStructs(structs, mapType);
    code += generateLambdas(lambdas, mapType);
    code += generateFunctions(functions, mapType);

    // Generate ID helpers for arrays
    for (const type of arrayTypes) {
        const safeName = type.replace(/[<>]/g, '_');
        code += `export function __idof_${safeName}(): u32 { return idof<${type}>(); }\n`;
    }

    return code;
}
