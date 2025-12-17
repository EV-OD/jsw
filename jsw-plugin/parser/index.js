import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { createGlobalsVisitor } from './visitors/globals.js';
import { createStructsVisitor } from './visitors/structs.js';
import { createFunctionsVisitor } from './visitors/functions.js';

export function parseFile(code) {
    const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript']
    });

    const state = {
        functions: [],
        structs: [],
        globals: [],
        lambdas: [],
        jsCallbacks: [],
        lambdaCounter: 0,
        jsCallbackCounter: 0
    };

    // 1. Extract Globals and Structs
    traverse.default(ast, createGlobalsVisitor(state.globals));
    traverse.default(ast, createStructsVisitor(state.structs));

    // 2. Process Functions
    traverse.default(ast, createFunctionsVisitor(state));

    return { 
        functions: state.functions, 
        structs: state.structs, 
        globals: state.globals, 
        lambdas: state.lambdas, 
        jsCallbacks: state.jsCallbacks 
    };
}
