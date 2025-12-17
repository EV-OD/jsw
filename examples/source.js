
export function add(a, b) {
  "use wasm";
  return a + b;
}

export function factorial(n) {
  "use wasm";
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

export function normalJS(x) {
  return x * 2;
}
