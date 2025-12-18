
function inline_add(a: number, b: number): number {
  "use wasm";
  return a + b;
}

function inline_calculate(x: number, y: number): number {
  "use wasm";
  let result = inline_add(x, y);
  return result * 2;
}
