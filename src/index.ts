
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

export function sumArray(arr: number[]): number {
  "use wasm";
  let sum: number = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

export function doubleArray(arr: number[]): number[] {
  "use wasm";
  let result: number[] = new Array<number>(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[i] * 2;
  }
  return result;
}

export interface Point {
  x: number;
  y: number;
}

export function addPoints(p1: Point, p2: Point): Point {
  "use wasm";
  let result: Point = { x: p1.x + p2.x, y: p1.y + p2.y };
  return result;
}

export interface Inner {
  val: number;
}

export interface Outer {
  name: string;
  inner: Inner;
  list: number[];
}

export function processOuter(o: Outer): Outer {
  "use wasm";
  let result: Outer = {
    name: "Processed " + o.name,
    inner: { val: o.inner.val + 1 },
    list: new Array<number>(o.list.length)
  };
  
  for(let i = 0; i < o.list.length; i++) {
    result.list[i] = o.list[i] * 2;
  }
  
  return result;
}

export function sumMatrix(mat: number[][]): number {
  "use wasm";
  let sum: number = 0;
  for (let i = 0; i < mat.length; i++) {
    let row = mat[i];
    for (let j = 0; j < row.length; j++) {
      sum += row[j];
    }
  }
  return sum;
}

export function transformPoints(points: Point[]): Point[] {
  "use wasm";
  let result = new Array<Point>(points.length);
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    result[i] = { x: p.x * 2, y: p.y * 2 };
  }
  return result;
}
