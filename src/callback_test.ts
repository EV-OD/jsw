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

export function getAdder(amount: number): (v: number) => number {
    "use wasm";
    return (v: number): number => {
        return v + amount;
    };
}

let globalX: number = 10;

export function addGlobal(y: number): number {
    "use wasm";
    return y + globalX;
}
