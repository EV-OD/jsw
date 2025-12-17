
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
