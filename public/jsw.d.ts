/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/**
 * assembly/generated/__new_Matrix
 * @returns `assembly/generated/Matrix`
 */
export declare function __new_Matrix(): __Record4<never>;
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
export declare function __set_Matrix_rows(obj: __Record4<undefined>, val: number): void;
/**
 * assembly/generated/__get_Matrix_rows
 * @param obj `assembly/generated/Matrix`
 * @returns `f64`
 */
export declare function __get_Matrix_rows(obj: __Record4<undefined>): number;
/**
 * assembly/generated/__set_Matrix_cols
 * @param obj `assembly/generated/Matrix`
 * @param val `f64`
 */
export declare function __set_Matrix_cols(obj: __Record4<undefined>, val: number): void;
/**
 * assembly/generated/__get_Matrix_cols
 * @param obj `assembly/generated/Matrix`
 * @returns `f64`
 */
export declare function __get_Matrix_cols(obj: __Record4<undefined>): number;
/**
 * assembly/generated/__set_Matrix_data
 * @param obj `assembly/generated/Matrix`
 * @param val `~lib/array/Array<f64>`
 */
export declare function __set_Matrix_data(obj: __Record4<undefined>, val: Array<number>): void;
/**
 * assembly/generated/__get_Matrix_data
 * @param obj `assembly/generated/Matrix`
 * @returns `~lib/array/Array<f64>`
 */
export declare function __get_Matrix_data(obj: __Record4<undefined>): Array<number>;
/**
 * assembly/generated/__new_Point
 * @returns `assembly/generated/Point`
 */
export declare function __new_Point(): __Record6<never>;
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
export declare function __set_Point_x(obj: __Record6<undefined>, val: number): void;
/**
 * assembly/generated/__get_Point_x
 * @param obj `assembly/generated/Point`
 * @returns `f64`
 */
export declare function __get_Point_x(obj: __Record6<undefined>): number;
/**
 * assembly/generated/__set_Point_y
 * @param obj `assembly/generated/Point`
 * @param val `f64`
 */
export declare function __set_Point_y(obj: __Record6<undefined>, val: number): void;
/**
 * assembly/generated/__get_Point_y
 * @param obj `assembly/generated/Point`
 * @returns `f64`
 */
export declare function __get_Point_y(obj: __Record6<undefined>): number;
/**
 * assembly/generated/__new_Inner
 * @returns `assembly/generated/Inner`
 */
export declare function __new_Inner(): __Record7<never>;
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
export declare function __set_Inner_val(obj: __Record7<undefined>, val: number): void;
/**
 * assembly/generated/__get_Inner_val
 * @param obj `assembly/generated/Inner`
 * @returns `f64`
 */
export declare function __get_Inner_val(obj: __Record7<undefined>): number;
/**
 * assembly/generated/__new_Outer
 * @returns `assembly/generated/Outer`
 */
export declare function __new_Outer(): __Record8<never>;
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
export declare function __set_Outer_name(obj: __Record8<undefined>, val: string): void;
/**
 * assembly/generated/__get_Outer_name
 * @param obj `assembly/generated/Outer`
 * @returns `~lib/string/String`
 */
export declare function __get_Outer_name(obj: __Record8<undefined>): string;
/**
 * assembly/generated/__set_Outer_inner
 * @param obj `assembly/generated/Outer`
 * @param val `assembly/generated/Inner`
 */
export declare function __set_Outer_inner(obj: __Record8<undefined>, val: __Record7<undefined>): void;
/**
 * assembly/generated/__get_Outer_inner
 * @param obj `assembly/generated/Outer`
 * @returns `assembly/generated/Inner`
 */
export declare function __get_Outer_inner(obj: __Record8<undefined>): __Record7<never>;
/**
 * assembly/generated/__set_Outer_list
 * @param obj `assembly/generated/Outer`
 * @param val `~lib/array/Array<f64>`
 */
export declare function __set_Outer_list(obj: __Record8<undefined>, val: Array<number>): void;
/**
 * assembly/generated/__get_Outer_list
 * @param obj `assembly/generated/Outer`
 * @returns `~lib/array/Array<f64>`
 */
export declare function __get_Outer_list(obj: __Record8<undefined>): Array<number>;
/**
 * assembly/generated/__idof_Array_f64_
 * @returns `u32`
 */
export declare function __idof_Array_f64_(): number;
/** assembly/generated/Matrix */
declare interface __Record4<TOmittable> {
  /** @type `f64` */
  rows: number | TOmittable;
  /** @type `f64` */
  cols: number | TOmittable;
  /** @type `~lib/array/Array<f64>` */
  data: Array<number>;
}
/** assembly/generated/Point */
declare interface __Record6<TOmittable> {
  /** @type `f64` */
  x: number | TOmittable;
  /** @type `f64` */
  y: number | TOmittable;
}
/** assembly/generated/Inner */
declare interface __Record7<TOmittable> {
  /** @type `f64` */
  val: number | TOmittable;
}
/** assembly/generated/Outer */
declare interface __Record8<TOmittable> {
  /** @type `~lib/string/String` */
  name: string;
  /** @type `assembly/generated/Inner` */
  inner: __Record7<never>;
  /** @type `~lib/array/Array<f64>` */
  list: Array<number>;
}
