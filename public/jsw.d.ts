/** Exported memory */
export declare const memory: WebAssembly.Memory;
/** Exported table */
export declare const table: WebAssembly.Table;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/**
 * assembly/generated/__new_Closure
 * @param index `u32`
 * @param env `usize`
 * @param type `u32`
 * @returns `assembly/generated/Closure`
 */
export declare function __new_Closure(index: number, env: number, type: number): __Internref4;
/**
 * assembly/generated/__get_Closure_index
 * @param c `assembly/generated/Closure`
 * @returns `u32`
 */
export declare function __get_Closure_index(c: __Internref4): number;
/**
 * assembly/generated/__get_Closure_env
 * @param c `assembly/generated/Closure`
 * @returns `usize`
 */
export declare function __get_Closure_env(c: __Internref4): number;
/**
 * assembly/generated/__get_Closure_type
 * @param c `assembly/generated/Closure`
 * @returns `u32`
 */
export declare function __get_Closure_type(c: __Internref4): number;
/** assembly/generated/seedTrain */
export declare const seedTrain: {
  /** @type `f64` */
  get value(): number;
  set value(value: number);
};
/** assembly/generated/seed */
export declare const seed: {
  /** @type `f64` */
  get value(): number;
  set value(value: number);
};
/** assembly/generated/__js_callback_createComplex_0_index */
export declare const __js_callback_createComplex_0_index: {
  /** @type `u32` */
  get value(): number;
  set value(value: number);
};
/** assembly/generated/__js_callback_createComplex_1_index */
export declare const __js_callback_createComplex_1_index: {
  /** @type `u32` */
  get value(): number;
  set value(value: number);
};
/** assembly/generated/__js_callback_createMixed_0_index */
export declare const __js_callback_createMixed_0_index: {
  /** @type `u32` */
  get value(): number;
  set value(value: number);
};
/** assembly/generated/__js_callback_createMixed_1_index */
export declare const __js_callback_createMixed_1_index: {
  /** @type `u32` */
  get value(): number;
  set value(value: number);
};
/** assembly/generated/g_amount */
export declare const g_amount: {
  /** @type `f64` */
  get value(): number;
  set value(value: number);
};
/** assembly/generated/globalX */
export declare const globalX: {
  /** @type `f64` */
  get value(): number;
  set value(value: number);
};
/** assembly/generated/seedBenchmark */
export declare const seedBenchmark: {
  /** @type `f64` */
  get value(): number;
  set value(value: number);
};
/**
 * assembly/generated/__new_Model
 * @returns `assembly/generated/Model`
 */
export declare function __new_Model(): __Internref5;
/**
 * assembly/generated/__idof_Model
 * @returns `u32`
 */
export declare function __idof_Model(): number;
/**
 * assembly/generated/__set_Model_weights
 * @param obj `assembly/generated/Model`
 * @param val `~lib/array/Array<~lib/array/Array<~lib/array/Array<f64>>>`
 */
export declare function __set_Model_weights(obj: __Internref5, val: Array<Array<Array<number>>>): void;
/**
 * assembly/generated/__get_Model_weights
 * @param obj `assembly/generated/Model`
 * @returns `~lib/array/Array<~lib/array/Array<~lib/array/Array<f64>>>`
 */
export declare function __get_Model_weights(obj: __Internref5): Array<Array<Array<number>>>;
/**
 * assembly/generated/__set_Model_biases
 * @param obj `assembly/generated/Model`
 * @param val `~lib/array/Array<~lib/array/Array<f64>>`
 */
export declare function __set_Model_biases(obj: __Internref5, val: Array<Array<number>>): void;
/**
 * assembly/generated/__get_Model_biases
 * @param obj `assembly/generated/Model`
 * @returns `~lib/array/Array<~lib/array/Array<f64>>`
 */
export declare function __get_Model_biases(obj: __Internref5): Array<Array<number>>;
/**
 * assembly/generated/__new_NestedObj
 * @returns `assembly/generated/NestedObj`
 */
export declare function __new_NestedObj(): __Record9<never>;
/**
 * assembly/generated/__idof_NestedObj
 * @returns `u32`
 */
export declare function __idof_NestedObj(): number;
/**
 * assembly/generated/__set_NestedObj_val
 * @param obj `assembly/generated/NestedObj`
 * @param val `f64`
 */
export declare function __set_NestedObj_val(obj: __Record9<undefined>, val: number): void;
/**
 * assembly/generated/__get_NestedObj_val
 * @param obj `assembly/generated/NestedObj`
 * @returns `f64`
 */
export declare function __get_NestedObj_val(obj: __Record9<undefined>): number;
/**
 * assembly/generated/__set_NestedObj_fn
 * @param obj `assembly/generated/NestedObj`
 * @param val `assembly/generated/Closure`
 */
export declare function __set_NestedObj_fn(obj: __Record9<undefined>, val: __Internref4): void;
/**
 * assembly/generated/__get_NestedObj_fn
 * @param obj `assembly/generated/NestedObj`
 * @returns `assembly/generated/Closure`
 */
export declare function __get_NestedObj_fn(obj: __Record9<undefined>): __Internref4;
/**
 * assembly/generated/__new_ComplexObj
 * @returns `assembly/generated/ComplexObj`
 */
export declare function __new_ComplexObj(): __Record10<never>;
/**
 * assembly/generated/__idof_ComplexObj
 * @returns `u32`
 */
export declare function __idof_ComplexObj(): number;
/**
 * assembly/generated/__set_ComplexObj_id
 * @param obj `assembly/generated/ComplexObj`
 * @param val `f64`
 */
export declare function __set_ComplexObj_id(obj: __Record10<undefined>, val: number): void;
/**
 * assembly/generated/__get_ComplexObj_id
 * @param obj `assembly/generated/ComplexObj`
 * @returns `f64`
 */
export declare function __get_ComplexObj_id(obj: __Record10<undefined>): number;
/**
 * assembly/generated/__set_ComplexObj_list
 * @param obj `assembly/generated/ComplexObj`
 * @param val `~lib/array/Array<f64>`
 */
export declare function __set_ComplexObj_list(obj: __Record10<undefined>, val: Array<number>): void;
/**
 * assembly/generated/__get_ComplexObj_list
 * @param obj `assembly/generated/ComplexObj`
 * @returns `~lib/array/Array<f64>`
 */
export declare function __get_ComplexObj_list(obj: __Record10<undefined>): Array<number>;
/**
 * assembly/generated/__set_ComplexObj_nested
 * @param obj `assembly/generated/ComplexObj`
 * @param val `assembly/generated/NestedObj`
 */
export declare function __set_ComplexObj_nested(obj: __Record10<undefined>, val: __Record9<undefined>): void;
/**
 * assembly/generated/__get_ComplexObj_nested
 * @param obj `assembly/generated/ComplexObj`
 * @returns `assembly/generated/NestedObj`
 */
export declare function __get_ComplexObj_nested(obj: __Record10<undefined>): __Record9<never>;
/**
 * assembly/generated/__set_ComplexObj_processor
 * @param obj `assembly/generated/ComplexObj`
 * @param val `assembly/generated/Closure`
 */
export declare function __set_ComplexObj_processor(obj: __Record10<undefined>, val: __Internref4): void;
/**
 * assembly/generated/__get_ComplexObj_processor
 * @param obj `assembly/generated/ComplexObj`
 * @returns `assembly/generated/Closure`
 */
export declare function __get_ComplexObj_processor(obj: __Record10<undefined>): __Internref4;
/**
 * assembly/generated/__new_MixedObj
 * @returns `assembly/generated/MixedObj`
 */
export declare function __new_MixedObj(): __Record11<never>;
/**
 * assembly/generated/__idof_MixedObj
 * @returns `u32`
 */
export declare function __idof_MixedObj(): number;
/**
 * assembly/generated/__set_MixedObj_wasmFn
 * @param obj `assembly/generated/MixedObj`
 * @param val `assembly/generated/Closure`
 */
export declare function __set_MixedObj_wasmFn(obj: __Record11<undefined>, val: __Internref4): void;
/**
 * assembly/generated/__get_MixedObj_wasmFn
 * @param obj `assembly/generated/MixedObj`
 * @returns `assembly/generated/Closure`
 */
export declare function __get_MixedObj_wasmFn(obj: __Record11<undefined>): __Internref4;
/**
 * assembly/generated/__set_MixedObj_jsFn
 * @param obj `assembly/generated/MixedObj`
 * @param val `assembly/generated/Closure`
 */
export declare function __set_MixedObj_jsFn(obj: __Record11<undefined>, val: __Internref4): void;
/**
 * assembly/generated/__get_MixedObj_jsFn
 * @param obj `assembly/generated/MixedObj`
 * @returns `assembly/generated/Closure`
 */
export declare function __get_MixedObj_jsFn(obj: __Record11<undefined>): __Internref4;
/**
 * assembly/generated/__new_Matrix
 * @returns `assembly/generated/Matrix`
 */
export declare function __new_Matrix(): __Record12<never>;
/**
 * assembly/generated/__idof_Matrix
 * @returns `u32`
 */
export declare function __idof_Matrix(): number;
/**
 * assembly/generated/__set_Matrix_rows
 * @param obj `assembly/generated/Matrix`
 * @param val `f64`
 */
export declare function __set_Matrix_rows(obj: __Record12<undefined>, val: number): void;
/**
 * assembly/generated/__get_Matrix_rows
 * @param obj `assembly/generated/Matrix`
 * @returns `f64`
 */
export declare function __get_Matrix_rows(obj: __Record12<undefined>): number;
/**
 * assembly/generated/__set_Matrix_cols
 * @param obj `assembly/generated/Matrix`
 * @param val `f64`
 */
export declare function __set_Matrix_cols(obj: __Record12<undefined>, val: number): void;
/**
 * assembly/generated/__get_Matrix_cols
 * @param obj `assembly/generated/Matrix`
 * @returns `f64`
 */
export declare function __get_Matrix_cols(obj: __Record12<undefined>): number;
/**
 * assembly/generated/__set_Matrix_data
 * @param obj `assembly/generated/Matrix`
 * @param val `~lib/array/Array<f64>`
 */
export declare function __set_Matrix_data(obj: __Record12<undefined>, val: Array<number>): void;
/**
 * assembly/generated/__get_Matrix_data
 * @param obj `assembly/generated/Matrix`
 * @returns `~lib/array/Array<f64>`
 */
export declare function __get_Matrix_data(obj: __Record12<undefined>): Array<number>;
/**
 * assembly/generated/__new_Point
 * @returns `assembly/generated/Point`
 */
export declare function __new_Point(): __Record13<never>;
/**
 * assembly/generated/__idof_Point
 * @returns `u32`
 */
export declare function __idof_Point(): number;
/**
 * assembly/generated/__set_Point_x
 * @param obj `assembly/generated/Point`
 * @param val `f64`
 */
export declare function __set_Point_x(obj: __Record13<undefined>, val: number): void;
/**
 * assembly/generated/__get_Point_x
 * @param obj `assembly/generated/Point`
 * @returns `f64`
 */
export declare function __get_Point_x(obj: __Record13<undefined>): number;
/**
 * assembly/generated/__set_Point_y
 * @param obj `assembly/generated/Point`
 * @param val `f64`
 */
export declare function __set_Point_y(obj: __Record13<undefined>, val: number): void;
/**
 * assembly/generated/__get_Point_y
 * @param obj `assembly/generated/Point`
 * @returns `f64`
 */
export declare function __get_Point_y(obj: __Record13<undefined>): number;
/**
 * assembly/generated/__new_Inner
 * @returns `assembly/generated/Inner`
 */
export declare function __new_Inner(): __Record14<never>;
/**
 * assembly/generated/__idof_Inner
 * @returns `u32`
 */
export declare function __idof_Inner(): number;
/**
 * assembly/generated/__set_Inner_val
 * @param obj `assembly/generated/Inner`
 * @param val `f64`
 */
export declare function __set_Inner_val(obj: __Record14<undefined>, val: number): void;
/**
 * assembly/generated/__get_Inner_val
 * @param obj `assembly/generated/Inner`
 * @returns `f64`
 */
export declare function __get_Inner_val(obj: __Record14<undefined>): number;
/**
 * assembly/generated/__new_Outer
 * @returns `assembly/generated/Outer`
 */
export declare function __new_Outer(): __Record15<never>;
/**
 * assembly/generated/__idof_Outer
 * @returns `u32`
 */
export declare function __idof_Outer(): number;
/**
 * assembly/generated/__set_Outer_name
 * @param obj `assembly/generated/Outer`
 * @param val `~lib/string/String`
 */
export declare function __set_Outer_name(obj: __Record15<undefined>, val: string): void;
/**
 * assembly/generated/__get_Outer_name
 * @param obj `assembly/generated/Outer`
 * @returns `~lib/string/String`
 */
export declare function __get_Outer_name(obj: __Record15<undefined>): string;
/**
 * assembly/generated/__set_Outer_inner
 * @param obj `assembly/generated/Outer`
 * @param val `assembly/generated/Inner`
 */
export declare function __set_Outer_inner(obj: __Record15<undefined>, val: __Record14<undefined>): void;
/**
 * assembly/generated/__get_Outer_inner
 * @param obj `assembly/generated/Outer`
 * @returns `assembly/generated/Inner`
 */
export declare function __get_Outer_inner(obj: __Record15<undefined>): __Record14<never>;
/**
 * assembly/generated/__set_Outer_list
 * @param obj `assembly/generated/Outer`
 * @param val `~lib/array/Array<f64>`
 */
export declare function __set_Outer_list(obj: __Record15<undefined>, val: Array<number>): void;
/**
 * assembly/generated/__get_Outer_list
 * @param obj `assembly/generated/Outer`
 * @returns `~lib/array/Array<f64>`
 */
export declare function __get_Outer_list(obj: __Record15<undefined>): Array<number>;
/**
 * assembly/generated/__new_Rect
 * @returns `assembly/generated/Rect`
 */
export declare function __new_Rect(): __Internref16;
/**
 * assembly/generated/__idof_Rect
 * @returns `u32`
 */
export declare function __idof_Rect(): number;
/**
 * assembly/generated/__set_Rect_x
 * @param obj `assembly/generated/Rect`
 * @param val `f64`
 */
export declare function __set_Rect_x(obj: __Internref16, val: number): void;
/**
 * assembly/generated/__get_Rect_x
 * @param obj `assembly/generated/Rect`
 * @returns `f64`
 */
export declare function __get_Rect_x(obj: __Internref16): number;
/**
 * assembly/generated/__set_Rect_y
 * @param obj `assembly/generated/Rect`
 * @param val `f64`
 */
export declare function __set_Rect_y(obj: __Internref16, val: number): void;
/**
 * assembly/generated/__get_Rect_y
 * @param obj `assembly/generated/Rect`
 * @returns `f64`
 */
export declare function __get_Rect_y(obj: __Internref16): number;
/**
 * assembly/generated/__set_Rect_width
 * @param obj `assembly/generated/Rect`
 * @param val `f64`
 */
export declare function __set_Rect_width(obj: __Internref16, val: number): void;
/**
 * assembly/generated/__get_Rect_width
 * @param obj `assembly/generated/Rect`
 * @returns `f64`
 */
export declare function __get_Rect_width(obj: __Internref16): number;
/**
 * assembly/generated/__set_Rect_height
 * @param obj `assembly/generated/Rect`
 * @param val `f64`
 */
export declare function __set_Rect_height(obj: __Internref16, val: number): void;
/**
 * assembly/generated/__get_Rect_height
 * @param obj `assembly/generated/Rect`
 * @returns `f64`
 */
export declare function __get_Rect_height(obj: __Internref16): number;
/**
 * assembly/generated/__new_BaseClass
 * @returns `assembly/generated/BaseClass`
 */
export declare function __new_BaseClass(): __Internref17;
/**
 * assembly/generated/__idof_BaseClass
 * @returns `u32`
 */
export declare function __idof_BaseClass(): number;
/**
 * assembly/generated/__set_BaseClass_instanceProp
 * @param obj `assembly/generated/BaseClass`
 * @param val `f64`
 */
export declare function __set_BaseClass_instanceProp(obj: __Internref17, val: number): void;
/**
 * assembly/generated/__get_BaseClass_instanceProp
 * @param obj `assembly/generated/BaseClass`
 * @returns `f64`
 */
export declare function __get_BaseClass_instanceProp(obj: __Internref17): number;
/**
 * assembly/generated/__new_ExtendedClass
 * @returns `assembly/generated/ExtendedClass`
 */
export declare function __new_ExtendedClass(): __Internref18;
/**
 * assembly/generated/__idof_ExtendedClass
 * @returns `u32`
 */
export declare function __idof_ExtendedClass(): number;
/**
 * assembly/generated/__set_ExtendedClass_extendedProp
 * @param obj `assembly/generated/ExtendedClass`
 * @param val `f64`
 */
export declare function __set_ExtendedClass_extendedProp(obj: __Internref18, val: number): void;
/**
 * assembly/generated/__get_ExtendedClass_extendedProp
 * @param obj `assembly/generated/ExtendedClass`
 * @returns `f64`
 */
export declare function __get_ExtendedClass_extendedProp(obj: __Internref18): number;
/**
 * assembly/generated/__lambda_getFunc_0
 * @param v `f64`
 * @returns `f64`
 */
export declare function __lambda_getFunc_0(v: number): number;
/**
 * assembly/generated/__lambda_getAdder_1
 * @param v `f64`
 * @returns `f64`
 */
export declare function __lambda_getAdder_1(v: number): number;
/**
 * assembly/generated/__lambda_testGlobalCapture_2
 * @param v `f64`
 * @returns `f64`
 */
export declare function __lambda_testGlobalCapture_2(v: number): number;
/**
 * assembly/generated/random1
 * @returns `f64`
 */
export declare function random1(): number;
/**
 * assembly/generated/max1
 * @param a `f64`
 * @param b `f64`
 * @returns `f64`
 */
export declare function max1(a: number, b: number): number;
/**
 * assembly/generated/trainModelWasm
 * @param data `~lib/array/Array<~lib/array/Array<f64>>`
 * @param labels `~lib/array/Array<~lib/array/Array<f64>>`
 * @param epochs `f64`
 * @param learningRate `f64`
 * @returns `assembly/generated/Model`
 */
export declare function trainModelWasm(data: Array<Array<number>>, labels: Array<Array<number>>, epochs: number, learningRate: number): __Internref5;
/**
 * assembly/generated/predictWasm
 * @param input `~lib/array/Array<f64>`
 * @param model `assembly/generated/Model`
 * @returns `~lib/array/Array<f64>`
 */
export declare function predictWasm(input: Array<number>, model: __Internref5): Array<number>;
/**
 * assembly/generated/createComplex
 * @param id `f64`
 * @returns `assembly/generated/ComplexObj`
 */
export declare function createComplex(id: number): __Record10<never>;
/**
 * assembly/generated/processComplex
 * @param obj `assembly/generated/ComplexObj`
 * @returns `f64`
 */
export declare function processComplex(obj: __Record10<undefined>): number;
/**
 * assembly/generated/createMixed
 * @returns `assembly/generated/MixedObj`
 */
export declare function createMixed(): __Record11<never>;
/**
 * assembly/generated/callMixed
 * @param obj `assembly/generated/MixedObj`
 * @returns `f64`
 */
export declare function callMixed(obj: __Record11<undefined>): number;
/**
 * assembly/generated/multiplyMatrix
 * @param m1 `assembly/generated/Matrix`
 * @param m2 `assembly/generated/Matrix`
 * @returns `assembly/generated/Matrix`
 */
export declare function multiplyMatrix(m1: __Record12<undefined>, m2: __Record12<undefined>): __Record12<never>;
/**
 * assembly/generated/inline_add
 * @param a `f64`
 * @param b `f64`
 * @returns `f64`
 */
export declare function inline_add(a: number, b: number): number;
/**
 * assembly/generated/inline_calculate
 * @param x `f64`
 * @param y `f64`
 * @returns `f64`
 */
export declare function inline_calculate(x: number, y: number): number;
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
 * @param a `f64`
 * @param b `f64`
 * @returns `f64`
 */
export declare function addInt(a: number, b: number): number;
/**
 * assembly/generated/sumArray
 * @param arr `~lib/array/Array<f64>`
 * @returns `f64`
 */
export declare function sumArray(arr: Array<number>): number;
/**
 * assembly/generated/doubleArray
 * @param arr `~lib/array/Array<f64>`
 * @returns `~lib/array/Array<f64>`
 */
export declare function doubleArray(arr: Array<number>): Array<number>;
/**
 * assembly/generated/addPoints
 * @param p1 `assembly/generated/Point`
 * @param p2 `assembly/generated/Point`
 * @returns `assembly/generated/Point`
 */
export declare function addPoints(p1: __Record13<undefined>, p2: __Record13<undefined>): __Record13<never>;
/**
 * assembly/generated/processOuter
 * @param o `assembly/generated/Outer`
 * @returns `assembly/generated/Outer`
 */
export declare function processOuter(o: __Record15<undefined>): __Record15<never>;
/**
 * assembly/generated/sumMatrix
 * @param mat `~lib/array/Array<~lib/array/Array<f64>>`
 * @returns `f64`
 */
export declare function sumMatrix(mat: Array<Array<number>>): number;
/**
 * assembly/generated/transformPoints
 * @param points `~lib/array/Array<assembly/generated/Point>`
 * @returns `~lib/array/Array<assembly/generated/Point>`
 */
export declare function transformPoints(points: Array<__Record13<undefined>>): Array<__Record13<never>>;
/**
 * assembly/generated/createRect
 * @param x `f64`
 * @param y `f64`
 * @param w `f64`
 * @param h `f64`
 * @returns `assembly/generated/Rect`
 */
export declare function createRect(x: number, y: number, w: number, h: number): __Internref16;
/**
 * assembly/generated/scaleRect
 * @param r `assembly/generated/Rect`
 * @param scale `f64`
 * @returns `assembly/generated/Rect`
 */
export declare function scaleRect(r: __Internref16, scale: number): __Internref16;
/**
 * assembly/generated/rectArea
 * @param r `assembly/generated/Rect`
 * @returns `f64`
 */
export declare function rectArea(r: __Internref16): number;
/**
 * assembly/generated/getStaticProp
 * @returns `f64`
 */
export declare function getStaticProp(): number;
/**
 * assembly/generated/testClassFeatures
 * @param value `f64`
 * @returns `f64`
 */
export declare function testClassFeatures(value: number): number;
/**
 * assembly/generated/testCallback
 * @param cb `u32`
 * @returns `f64`
 */
export declare function testCallback(cb: number): number;
/**
 * assembly/generated/getFunc
 * @returns `assembly/generated/Closure`
 */
export declare function getFunc(): __Internref4;
/**
 * assembly/generated/getAdder
 * @param amount `f64`
 * @returns `assembly/generated/Closure`
 */
export declare function getAdder(amount: number): __Internref4;
/**
 * assembly/generated/testGlobalCapture
 * @returns `assembly/generated/Closure`
 */
export declare function testGlobalCapture(): __Internref4;
/**
 * assembly/generated/addGlobal
 * @param v `f64`
 * @returns `f64`
 */
export declare function addGlobal(v: number): number;
/**
 * assembly/generated/isPrimeWasm
 * @param n `f64`
 * @returns `bool`
 */
export declare function isPrimeWasm(n: number): boolean;
/**
 * assembly/generated/countPrimesWasm
 * @param limit `f64`
 * @returns `f64`
 */
export declare function countPrimesWasm(limit: number): number;
/**
 * assembly/generated/fibInner
 * @param n `f64`
 * @returns `f64`
 */
export declare function fibInner(n: number): number;
/**
 * assembly/generated/fibonacciWasm
 * @param n `f64`
 * @returns `f64`
 */
export declare function fibonacciWasm(n: number): number;
/**
 * assembly/generated/bubbleSortWasm
 * @param arr `~lib/array/Array<f64>`
 * @returns `~lib/array/Array<f64>`
 */
export declare function bubbleSortWasm(arr: Array<number>): Array<number>;
/**
 * assembly/generated/matrixMultiplyWasm
 * @param a `~lib/array/Array<f64>`
 * @param b `~lib/array/Array<f64>`
 * @param size `f64`
 * @returns `~lib/array/Array<f64>`
 */
export declare function matrixMultiplyWasm(a: Array<number>, b: Array<number>, size: number): Array<number>;
/**
 * assembly/generated/monteCarloPiWasm
 * @param iterations `f64`
 * @returns `f64`
 */
export declare function monteCarloPiWasm(iterations: number): number;
/**
 * assembly/generated/findPathWasm
 * @param width `f64`
 * @param height `f64`
 * @param walls `~lib/array/Array<f64>`
 * @param startX `f64`
 * @param startY `f64`
 * @param endX `f64`
 * @param endY `f64`
 * @returns `~lib/array/Array<f64>`
 */
export declare function findPathWasm(width: number, height: number, walls: Array<number>, startX: number, startY: number, endX: number, endY: number): Array<number>;
/** assembly/generated/Closure */
declare class __Internref4 extends Number {
  private __nominal4: symbol;
  private __nominal0: symbol;
}
/** assembly/generated/Model */
declare class __Internref5 extends Number {
  private __nominal5: symbol;
  private __nominal0: symbol;
}
/** assembly/generated/NestedObj */
declare interface __Record9<TOmittable> {
  /** @type `f64` */
  val: number | TOmittable;
  /** @type `assembly/generated/Closure` */
  fn: __Internref4;
}
/** assembly/generated/ComplexObj */
declare interface __Record10<TOmittable> {
  /** @type `f64` */
  id: number | TOmittable;
  /** @type `~lib/array/Array<f64>` */
  list: Array<number>;
  /** @type `assembly/generated/NestedObj` */
  nested: __Record9<never>;
  /** @type `assembly/generated/Closure` */
  processor: __Internref4;
}
/** assembly/generated/MixedObj */
declare interface __Record11<TOmittable> {
  /** @type `assembly/generated/Closure` */
  wasmFn: __Internref4;
  /** @type `assembly/generated/Closure` */
  jsFn: __Internref4;
}
/** assembly/generated/Matrix */
declare interface __Record12<TOmittable> {
  /** @type `f64` */
  rows: number | TOmittable;
  /** @type `f64` */
  cols: number | TOmittable;
  /** @type `~lib/array/Array<f64>` */
  data: Array<number>;
}
/** assembly/generated/Point */
declare interface __Record13<TOmittable> {
  /** @type `f64` */
  x: number | TOmittable;
  /** @type `f64` */
  y: number | TOmittable;
}
/** assembly/generated/Inner */
declare interface __Record14<TOmittable> {
  /** @type `f64` */
  val: number | TOmittable;
}
/** assembly/generated/Outer */
declare interface __Record15<TOmittable> {
  /** @type `~lib/string/String` */
  name: string;
  /** @type `assembly/generated/Inner` */
  inner: __Record14<never>;
  /** @type `~lib/array/Array<f64>` */
  list: Array<number>;
}
/** assembly/generated/Rect */
declare class __Internref16 extends Number {
  private __nominal16: symbol;
  private __nominal0: symbol;
}
/** assembly/generated/BaseClass */
declare class __Internref17 extends Number {
  private __nominal17: symbol;
  private __nominal0: symbol;
}
/** assembly/generated/ExtendedClass */
declare class __Internref18 extends Number {
  private __nominal18: symbol;
  private __nominal17: symbol;
  private __nominal0: symbol;
}
