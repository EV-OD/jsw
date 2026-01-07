
export function isPrimeWasm(n: number): boolean {
    "use wasm";
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    let i = 5;
    while (i * i <= n) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
        i = i + 6;
    }
    return true;
}

export function countPrimesWasm(limit: number): number {
    "use wasm";
    let lim = <i32>limit;
    let count = 0;
    for (let i = 0; i < lim; i++) {
        if (i <= 1) continue;
        if (i <= 3) { count++; continue; }
        if (i % 2 == 0 || i % 3 == 0) continue;
        
        let isP = true;
        let k = 5;
        // i and k are i32 automatically
        while (k * k <= i) {
            if (i % k == 0 || i % (k + 2) == 0) {
                isP = false;
                break;
            }
            k = k + 6;
        }
        if (isP) count++;
    }
    return <f64>count;
}

function fibInner(n: number): number {
    "use wasm";
    if (n <= 1) return n;
    return fibInner(n - 1) + fibInner(n - 2);
}

export function fibonacciWasm(n: number): number {
    "use wasm";
    return fibInner(n);
}

export function bubbleSortWasm(arr: number[]): number[] {
    "use wasm";
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            let val1 = arr[j];
            let val2 = arr[j + 1];
            if (val1 > val2) {
                arr[j] = val2;
                arr[j + 1] = val1;
            }
        }
    }
    return arr;
}

export function matrixMultiplyWasm(a: number[], b: number[], size: number): number[] {
    "use wasm";
    let s = <i32>size;
    let result = new Array<number>(s * s);
    
    // Transpose B
    let bT = new Array<number>(s * s);
    for (let i = 0; i < s; i++) {
        for (let j = 0; j < s; j++) {
            bT[i * s + j] = b[j * s + i];
        }
    }

    for (let i = 0; i < s; i++) {
        for (let j = 0; j < s; j++) {
            let sum: f64 = 0;
            let i_s = i * s;
            let j_s = j * s; 
            
            for (let k = 0; k < s; k++) {
                let valA = a[i_s + k];
                let valB = bT[j_s + k];
                sum = sum + valA * valB;
            }
            result[i_s + j] = sum;
        }
    }
    return result;
}

let seedBenchmark: number = 123456789;

export function monteCarloPiWasm(iterations: number): number {
    "use wasm";
    let iter = <i32>iterations;
    let inside = 0;
    
    let s = <i32>seedBenchmark; 

    for (let i = 0; i < iter; i++) {
        s = s * 1664525 + 1013904223;
        let x = <f64>(u32(s)) / 4294967296.0;

        s = s * 1664525 + 1013904223;
        let y = <f64>(u32(s)) / 4294967296.0;

        if (x * x + y * y <= 1.0) {
            inside++;
        }
    }
    
    seedBenchmark = <f64>s;
    return (<f64>inside / <f64>iter) * 4.0;
}
