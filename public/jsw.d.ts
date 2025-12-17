/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/generated/add
 * @param a `f64`
 * @param b `f64`
 * @returns `f64`
 */
export declare function add(a: number, b: number): number;
/**
 * assembly/generated/factorial
 * @param n `f64`
 * @returns `f64`
 */
export declare function factorial(n: number): number;
/**
 * assembly/generated/greet
 * @param name `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function greet(name: string): string;
/**
 * assembly/generated/addInt
 * @param a `i32`
 * @param b `i32`
 * @returns `i32`
 */
export declare function addInt(a: number, b: number): number;
