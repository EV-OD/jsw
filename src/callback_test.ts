export function testCallback(cb: (v: number) => number): number {
  "use wasm";
  return cb(21);
}

export function getFunc(): (v: number) => number {
  "use wasm";
  return (v: number): number => {
    return v * 2;
  };
}

let g_amount: number = 0;
export function getAdder(amount: number): (v: number) => number {
    "use wasm";
    g_amount = amount;
    return (v: number): number => {
        return v + g_amount;
    };
}

let globalX: number = 10;
export function testGlobalCapture(): (v: number) => number {
    "use wasm";
    return (v: number): number => {
        return v + globalX;
    };
}

export function addGlobal(v: number): number {
  "use wasm";
  return v + globalX;
}
