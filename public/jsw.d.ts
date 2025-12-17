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
/** assembly/generated/globalX */
export declare const globalX: {
  /** @type `f64` */
  get value(): number;
  set value(value: number);
};
/**
 * assembly/generated/__new_NestedObj
 * @returns `assembly/generated/NestedObj`
 */
export declare function __new_NestedObj(): __Record5<never>;
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
export declare function __set_NestedObj_val(obj: __Record5<undefined>, val: number): void;
/**
 * assembly/generated/__get_NestedObj_val
 * @param obj `assembly/generated/NestedObj`
 * @returns `f64`
 */
export declare function __get_NestedObj_val(obj: __Record5<undefined>): number;
/**
 * assembly/generated/__set_NestedObj_fn
 * @param obj `assembly/generated/NestedObj`
 * @param val `assembly/generated/Closure`
 */
export declare function __set_NestedObj_fn(obj: __Record5<undefined>, val: __Internref4): void;
/**
 * assembly/generated/__get_NestedObj_fn
 * @param obj `assembly/generated/NestedObj`
 * @returns `assembly/generated/Closure`
 */
export declare function __get_NestedObj_fn(obj: __Record5<undefined>): __Internref4;
/**
 * assembly/generated/__new_ComplexObj
 * @returns `assembly/generated/ComplexObj`
 */
export declare function __new_ComplexObj(): __Record6<never>;
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
export declare function __set_ComplexObj_id(obj: __Record6<undefined>, val: number): void;
/**
 * assembly/generated/__get_ComplexObj_id
 * @param obj `assembly/generated/ComplexObj`
 * @returns `f64`
 */
export declare function __get_ComplexObj_id(obj: __Record6<undefined>): number;
/**
 * assembly/generated/__set_ComplexObj_list
 * @param obj `assembly/generated/ComplexObj`
 * @param val `~lib/array/Array<f64>`
 */
export declare function __set_ComplexObj_list(obj: __Record6<undefined>, val: Array<number>): void;
/**
 * assembly/generated/__get_ComplexObj_list
 * @param obj `assembly/generated/ComplexObj`
 * @returns `~lib/array/Array<f64>`
 */
export declare function __get_ComplexObj_list(obj: __Record6<undefined>): Array<number>;
/**
 * assembly/generated/__set_ComplexObj_nested
 * @param obj `assembly/generated/ComplexObj`
 * @param val `assembly/generated/NestedObj`
 */
export declare function __set_ComplexObj_nested(obj: __Record6<undefined>, val: __Record5<undefined>): void;
/**
 * assembly/generated/__get_ComplexObj_nested
 * @param obj `assembly/generated/ComplexObj`
 * @returns `assembly/generated/NestedObj`
 */
export declare function __get_ComplexObj_nested(obj: __Record6<undefined>): __Record5<never>;
/**
 * assembly/generated/__set_ComplexObj_processor
 * @param obj `assembly/generated/ComplexObj`
 * @param val `assembly/generated/Closure`
 */
export declare function __set_ComplexObj_processor(obj: __Record6<undefined>, val: __Internref4): void;
/**
 * assembly/generated/__get_ComplexObj_processor
 * @param obj `assembly/generated/ComplexObj`
 * @returns `assembly/generated/Closure`
 */
export declare function __get_ComplexObj_processor(obj: __Record6<undefined>): __Internref4;
/**
 * assembly/generated/__new_MixedObj
 * @returns `assembly/generated/MixedObj`
 */
export declare function __new_MixedObj(): __Record8<never>;
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
export declare function __set_MixedObj_wasmFn(obj: __Record8<undefined>, val: __Internref4): void;
/**
 * assembly/generated/__get_MixedObj_wasmFn
 * @param obj `assembly/generated/MixedObj`
 * @returns `assembly/generated/Closure`
 */
export declare function __get_MixedObj_wasmFn(obj: __Record8<undefined>): __Internref4;
/**
 * assembly/generated/__set_MixedObj_jsFn
 * @param obj `assembly/generated/MixedObj`
 * @param val `assembly/generated/Closure`
 */
export declare function __set_MixedObj_jsFn(obj: __Record8<undefined>, val: __Internref4): void;
/**
 * assembly/generated/__get_MixedObj_jsFn
 * @param obj `assembly/generated/MixedObj`
 * @returns `assembly/generated/Closure`
 */
export declare function __get_MixedObj_jsFn(obj: __Record8<undefined>): __Internref4;
/**
 * assembly/generated/__new_Matrix
 * @returns `assembly/generated/Matrix`
 */
export declare function __new_Matrix(): __Record9<never>;
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
export declare function __set_Matrix_rows(obj: __Record9<undefined>, val: number): void;
/**
 * assembly/generated/__get_Matrix_rows
 * @param obj `assembly/generated/Matrix`
 * @returns `f64`
 */
export declare function __get_Matrix_rows(obj: __Record9<undefined>): number;
/**
 * assembly/generated/__set_Matrix_cols
 * @param obj `assembly/generated/Matrix`
 * @param val `f64`
 */
export declare function __set_Matrix_cols(obj: __Record9<undefined>, val: number): void;
/**
 * assembly/generated/__get_Matrix_cols
 * @param obj `assembly/generated/Matrix`
 * @returns `f64`
 */
export declare function __get_Matrix_cols(obj: __Record9<undefined>): number;
/**
 * assembly/generated/__set_Matrix_data
 * @param obj `assembly/generated/Matrix`
 * @param val `~lib/array/Array<f64>`
 */
export declare function __set_Matrix_data(obj: __Record9<undefined>, val: Array<number>): void;
/**
 * assembly/generated/__get_Matrix_data
 * @param obj `assembly/generated/Matrix`
 * @returns `~lib/array/Array<f64>`
 */
export declare function __get_Matrix_data(obj: __Record9<undefined>): Array<number>;
/**
 * assembly/generated/__new_Point
 * @returns `assembly/generated/Point`
 */
export declare function __new_Point(): __Record10<never>;
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
export declare function __set_Point_x(obj: __Record10<undefined>, val: number): void;
/**
 * assembly/generated/__get_Point_x
 * @param obj `assembly/generated/Point`
 * @returns `f64`
 */
export declare function __get_Point_x(obj: __Record10<undefined>): number;
/**
 * assembly/generated/__set_Point_y
 * @param obj `assembly/generated/Point`
 * @param val `f64`
 */
export declare function __set_Point_y(obj: __Record10<undefined>, val: number): void;
/**
 * assembly/generated/__get_Point_y
 * @param obj `assembly/generated/Point`
 * @returns `f64`
 */
export declare function __get_Point_y(obj: __Record10<undefined>): number;
/**
 * assembly/generated/__new_Inner
 * @returns `assembly/generated/Inner`
 */
export declare function __new_Inner(): __Record11<never>;
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
export declare function __set_Inner_val(obj: __Record11<undefined>, val: number): void;
/**
 * assembly/generated/__get_Inner_val
 * @param obj `assembly/generated/Inner`
 * @returns `f64`
 */
export declare function __get_Inner_val(obj: __Record11<undefined>): number;
/**
 * assembly/generated/__new_Outer
 * @returns `assembly/generated/Outer`
 */
export declare function __new_Outer(): __Record12<never>;
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
export declare function __set_Outer_name(obj: __Record12<undefined>, val: string): void;
/**
 * assembly/generated/__get_Outer_name
 * @param obj `assembly/generated/Outer`
 * @returns `~lib/string/String`
 */
export declare function __get_Outer_name(obj: __Record12<undefined>): string;
/**
 * assembly/generated/__set_Outer_inner
 * @param obj `assembly/generated/Outer`
 * @param val `assembly/generated/Inner`
 */
export declare function __set_Outer_inner(obj: __Record12<undefined>, val: __Record11<undefined>): void;
/**
 * assembly/generated/__get_Outer_inner
 * @param obj `assembly/generated/Outer`
 * @returns `assembly/generated/Inner`
 */
export declare function __get_Outer_inner(obj: __Record12<undefined>): __Record11<never>;
/**
 * assembly/generated/__set_Outer_list
 * @param obj `assembly/generated/Outer`
 * @param val `~lib/array/Array<f64>`
 */
export declare function __set_Outer_list(obj: __Record12<undefined>, val: Array<number>): void;
/**
 * assembly/generated/__get_Outer_list
 * @param obj `assembly/generated/Outer`
 * @returns `~lib/array/Array<f64>`
 */
export declare function __get_Outer_list(obj: __Record12<undefined>): Array<number>;
/**
 * assembly/generated/__new_Rect
 * @returns `assembly/generated/Rect`
 */
export declare function __new_Rect(): __Internref13;
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
export declare function __set_Rect_x(obj: __Internref13, val: number): void;
/**
 * assembly/generated/__get_Rect_x
 * @param obj `assembly/generated/Rect`
 * @returns `f64`
 */
export declare function __get_Rect_x(obj: __Internref13): number;
/**
 * assembly/generated/__set_Rect_y
 * @param obj `assembly/generated/Rect`
 * @param val `f64`
 */
export declare function __set_Rect_y(obj: __Internref13, val: number): void;
/**
 * assembly/generated/__get_Rect_y
 * @param obj `assembly/generated/Rect`
 * @returns `f64`
 */
export declare function __get_Rect_y(obj: __Internref13): number;
/**
 * assembly/generated/__set_Rect_width
 * @param obj `assembly/generated/Rect`
 * @param val `f64`
 */
export declare function __set_Rect_width(obj: __Internref13, val: number): void;
/**
 * assembly/generated/__get_Rect_width
 * @param obj `assembly/generated/Rect`
 * @returns `f64`
 */
export declare function __get_Rect_width(obj: __Internref13): number;
/**
 * assembly/generated/__set_Rect_height
 * @param obj `assembly/generated/Rect`
 * @param val `f64`
 */
export declare function __set_Rect_height(obj: __Internref13, val: number): void;
/**
 * assembly/generated/__get_Rect_height
 * @param obj `assembly/generated/Rect`
 * @returns `f64`
 */
export declare function __get_Rect_height(obj: __Internref13): number;
/** assembly/generated/Closure */
declare class __Internref4 extends Number {
  private __nominal4: symbol;
  private __nominal0: symbol;
}
/** assembly/generated/NestedObj */
declare interface __Record5<TOmittable> {
  /** @type `f64` */
  val: number | TOmittable;
  /** @type `assembly/generated/Closure` */
  fn: __Internref4;
}
/** assembly/generated/ComplexObj */
declare interface __Record6<TOmittable> {
  /** @type `f64` */
  id: number | TOmittable;
  /** @type `~lib/array/Array<f64>` */
  list: Array<number>;
  /** @type `assembly/generated/NestedObj` */
  nested: __Record5<never>;
  /** @type `assembly/generated/Closure` */
  processor: __Internref4;
}
/** assembly/generated/MixedObj */
declare interface __Record8<TOmittable> {
  /** @type `assembly/generated/Closure` */
  wasmFn: __Internref4;
  /** @type `assembly/generated/Closure` */
  jsFn: __Internref4;
}
/** assembly/generated/Matrix */
declare interface __Record9<TOmittable> {
  /** @type `f64` */
  rows: number | TOmittable;
  /** @type `f64` */
  cols: number | TOmittable;
  /** @type `~lib/array/Array<f64>` */
  data: Array<number>;
}
/** assembly/generated/Point */
declare interface __Record10<TOmittable> {
  /** @type `f64` */
  x: number | TOmittable;
  /** @type `f64` */
  y: number | TOmittable;
}
/** assembly/generated/Inner */
declare interface __Record11<TOmittable> {
  /** @type `f64` */
  val: number | TOmittable;
}
/** assembly/generated/Outer */
declare interface __Record12<TOmittable> {
  /** @type `~lib/string/String` */
  name: string;
  /** @type `assembly/generated/Inner` */
  inner: __Record11<never>;
  /** @type `~lib/array/Array<f64>` */
  list: Array<number>;
}
/** assembly/generated/Rect */
declare class __Internref13 extends Number {
  private __nominal13: symbol;
  private __nominal0: symbol;
}
