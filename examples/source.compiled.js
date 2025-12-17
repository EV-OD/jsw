
import fs from 'fs';
import loader from '@assemblyscript/loader';
const wasmModule = await loader.instantiate(fs.readFileSync('./build/release.wasm'));
const wasmExports = wasmModule.exports;
export function add(a, b) {
  return wasmExports.add(a, b);
}
export function factorial(n) {
  return wasmExports.factorial(n);
}
export function normalJS(x) {
  return x * 2;
}
