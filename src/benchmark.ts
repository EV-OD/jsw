
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
    let lim = limit | 0;
    let count = 0;
    for (let i = 0; i < lim; i++) {
        // Inline isPrime for maximum performance (avoids call overhead & float conversion)
        if (i <= 1) continue;
        if (i <= 3) { count++; continue; }
        if (i % 2 == 0 || i % 3 == 0) continue;
        
        let isP = true;
        let k = 5;
        while (k * k <= i) {
            if (i % k == 0 || i % (k + 2) == 0) {
                isP = false;
                break;
            }
            k = k + 6;
        }
        if (isP) count++;
    }
    return count;
}

// Internal helper for fast recursion (avoids export table lookup)
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
    let s = size | 0;
    let result = new Array<number>(s * s);
    
    // Transpose B for cache locality (huge performance win)
    let bT = new Array<number>(s * s);
    for (let i = 0; i < s; i++) {
        for (let j = 0; j < s; j++) {
            bT[i * s + j] = b[j * s + i];
        }
    }

    for (let i = 0; i < s; i++) {
        for (let j = 0; j < s; j++) {
            let sum = 0;
            // Pre-calculate row offset
            let i_s = (i * s) | 0;
            let j_s = (j * s) | 0; // Row in transposed B
            
            for (let k = 0; k < s; k++) {
                // Linear access on both A and bT
                // Automatic unchecked access via plugin
                let valA = a[i_s + k];
                let valB = bT[j_s + k];
                sum = sum + valA * valB;
            }
            result[i_s + j] = sum;
        }
    }
    return result;
}

// // Simple LCG for deterministic random numbers in Wasm
let seed: number = 123456789;
// function random(): number {
//     "use wasm";
//     // LCG constants: a = 1664525, c = 1013904223
//     seed = (seed * 1664525 + 1013904223) | 0;
//     // Convert to float [0, 1)
//     return (seed >>> 0) / 4294967296.0;
// }

export function monteCarloPiWasm(iterations: number): number {
    "use wasm";
    let iter = iterations | 0;
    let inside = 0;
    
    // Use a local variable for seed to ensure it stays in a register
    let s = seed; 

    for (let i = 0; i < iter; i++) {
        // Inline random() #1
        s = (s * 1664525 + 1013904223) | 0;
        let x = (s >>> 0) / 4294967296.0;

        // Inline random() #2
        s = (s * 1664525 + 1013904223) | 0;
        let y = (s >>> 0) / 4294967296.0;

        if (x * x + y * y <= 1.0) {
            inside++;
        }
    }
    
    // Update the global seed at the end
    seed = s;
    return (inside / iterations) * 4.0;
}
