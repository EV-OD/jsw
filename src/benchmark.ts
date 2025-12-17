
// Helper for integer casting
function int(n: number): number {
    return n | 0;
}

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
    let count = 0;
    for (let i = 0; i < limit; i++) {
        if (isPrimeWasm(i)) {
            count = count + 1;
        }
    }
    return count;
}

export function fibonacciWasm(n: number): number {
    "use wasm";
    if (n <= 1) return n;
    return fibonacciWasm(n - 1) + fibonacciWasm(n - 2);
}

export function bubbleSortWasm(arr: number[]): number[] {
    "use wasm";
    let len = int(arr.length);
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

export function matrixMultiplyWasm(a: number[], b: number[], size: number): number[] {
    "use wasm";
    let result = new Array<number>(size * size);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let sum = 0;
            for (let k = 0; k < size; k++) {
                sum = sum + a[i * size + k] * b[k * size + j];
            }
            result[i * size + j] = sum;
        }
    }
    return result;
}
