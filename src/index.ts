
export function add(a: number, b: number): number {
  "use wasm";
  return a * b;
}

export function factorial(n: number): number {
  "use wasm";
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

export function greet(name: string): string {
  "use wasm";
  console.log("Greeting from Wasm!");
  return "Hello, " + name;
}

export function addInt(a: number, b: number): number {
  "use wasm";
  return a + b;
}

export function normalJS(x: number): number {
  return x * 2;
}
