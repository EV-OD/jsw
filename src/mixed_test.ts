
export interface MixedObj {
    wasmFn: () => number;
    jsFn: () => number;
}

export function createMixed(): MixedObj {
    "use wasm";
    return {
        wasmFn: (): number => {
            "use wasm";
            return 42;
        },
        jsFn: (): number => {
            // No "use wasm" -> JS Callback
            return 100;
        }
    };
}

export function callMixed(obj: MixedObj): number {
    "use wasm";
    return obj.wasmFn() + obj.jsFn();
}
