
export interface NestedObj {
    val: number;
    fn: (x: number) => number;
}

export interface ComplexObj {
    id: number;
    list: number[];
    nested: NestedObj;
    processor: (n: number) => number;
}

export function createComplex(id: number): ComplexObj {
    "use wasm";
    return {
        id: id,
        list: [1, 2, 3],
        nested: {
            val: id * 2,
            fn: (x: number): number => x + 1
        },
        processor: (n: number): number => n * id
    };
}

export function processComplex(obj: ComplexObj): number {
    "use wasm";
    return obj.processor(obj.nested.val) + obj.nested.fn(10);
}
