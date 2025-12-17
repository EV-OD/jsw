async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.setPrototypeOf({
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
    }, Object.assign(Object.create(globalThis), imports.env || {})),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    __new_Closure(index, env, type) {
      // assembly/generated/__new_Closure(u32, usize, u32) => assembly/generated/Closure
      return __liftInternref(exports.__new_Closure(index, env, type) >>> 0);
    },
    __get_Closure_index(c) {
      // assembly/generated/__get_Closure_index(assembly/generated/Closure) => u32
      c = __lowerInternref(c) || __notnull();
      return exports.__get_Closure_index(c) >>> 0;
    },
    __get_Closure_env(c) {
      // assembly/generated/__get_Closure_env(assembly/generated/Closure) => usize
      c = __lowerInternref(c) || __notnull();
      return exports.__get_Closure_env(c) >>> 0;
    },
    __get_Closure_type(c) {
      // assembly/generated/__get_Closure_type(assembly/generated/Closure) => u32
      c = __lowerInternref(c) || __notnull();
      return exports.__get_Closure_type(c) >>> 0;
    },
    __new_NestedObj() {
      // assembly/generated/__new_NestedObj() => assembly/generated/NestedObj
      return __liftRecord5(exports.__new_NestedObj() >>> 0);
    },
    __idof_NestedObj() {
      // assembly/generated/__idof_NestedObj() => u32
      return exports.__idof_NestedObj() >>> 0;
    },
    __set_NestedObj_val(obj, val) {
      // assembly/generated/__set_NestedObj_val(assembly/generated/NestedObj, f64) => void
      obj = __lowerRecord5(obj) || __notnull();
      exports.__set_NestedObj_val(obj, val);
    },
    __get_NestedObj_val(obj) {
      // assembly/generated/__get_NestedObj_val(assembly/generated/NestedObj) => f64
      obj = __lowerRecord5(obj) || __notnull();
      return exports.__get_NestedObj_val(obj);
    },
    __set_NestedObj_fn(obj, val) {
      // assembly/generated/__set_NestedObj_fn(assembly/generated/NestedObj, assembly/generated/Closure) => void
      obj = __retain(__lowerRecord5(obj) || __notnull());
      val = __lowerInternref(val) || __notnull();
      try {
        exports.__set_NestedObj_fn(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_NestedObj_fn(obj) {
      // assembly/generated/__get_NestedObj_fn(assembly/generated/NestedObj) => assembly/generated/Closure
      obj = __lowerRecord5(obj) || __notnull();
      return __liftInternref(exports.__get_NestedObj_fn(obj) >>> 0);
    },
    __new_ComplexObj() {
      // assembly/generated/__new_ComplexObj() => assembly/generated/ComplexObj
      return __liftRecord6(exports.__new_ComplexObj() >>> 0);
    },
    __idof_ComplexObj() {
      // assembly/generated/__idof_ComplexObj() => u32
      return exports.__idof_ComplexObj() >>> 0;
    },
    __set_ComplexObj_id(obj, val) {
      // assembly/generated/__set_ComplexObj_id(assembly/generated/ComplexObj, f64) => void
      obj = __lowerRecord6(obj) || __notnull();
      exports.__set_ComplexObj_id(obj, val);
    },
    __get_ComplexObj_id(obj) {
      // assembly/generated/__get_ComplexObj_id(assembly/generated/ComplexObj) => f64
      obj = __lowerRecord6(obj) || __notnull();
      return exports.__get_ComplexObj_id(obj);
    },
    __set_ComplexObj_list(obj, val) {
      // assembly/generated/__set_ComplexObj_list(assembly/generated/ComplexObj, ~lib/array/Array<f64>) => void
      obj = __retain(__lowerRecord6(obj) || __notnull());
      val = __lowerArray(__setF64, 7, 3, val) || __notnull();
      try {
        exports.__set_ComplexObj_list(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_ComplexObj_list(obj) {
      // assembly/generated/__get_ComplexObj_list(assembly/generated/ComplexObj) => ~lib/array/Array<f64>
      obj = __lowerRecord6(obj) || __notnull();
      return __liftArray(__getF64, 3, exports.__get_ComplexObj_list(obj) >>> 0);
    },
    __set_ComplexObj_nested(obj, val) {
      // assembly/generated/__set_ComplexObj_nested(assembly/generated/ComplexObj, assembly/generated/NestedObj) => void
      obj = __retain(__lowerRecord6(obj) || __notnull());
      val = __lowerRecord5(val) || __notnull();
      try {
        exports.__set_ComplexObj_nested(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_ComplexObj_nested(obj) {
      // assembly/generated/__get_ComplexObj_nested(assembly/generated/ComplexObj) => assembly/generated/NestedObj
      obj = __lowerRecord6(obj) || __notnull();
      return __liftRecord5(exports.__get_ComplexObj_nested(obj) >>> 0);
    },
    __set_ComplexObj_processor(obj, val) {
      // assembly/generated/__set_ComplexObj_processor(assembly/generated/ComplexObj, assembly/generated/Closure) => void
      obj = __retain(__lowerRecord6(obj) || __notnull());
      val = __lowerInternref(val) || __notnull();
      try {
        exports.__set_ComplexObj_processor(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_ComplexObj_processor(obj) {
      // assembly/generated/__get_ComplexObj_processor(assembly/generated/ComplexObj) => assembly/generated/Closure
      obj = __lowerRecord6(obj) || __notnull();
      return __liftInternref(exports.__get_ComplexObj_processor(obj) >>> 0);
    },
    __new_MixedObj() {
      // assembly/generated/__new_MixedObj() => assembly/generated/MixedObj
      return __liftRecord8(exports.__new_MixedObj() >>> 0);
    },
    __idof_MixedObj() {
      // assembly/generated/__idof_MixedObj() => u32
      return exports.__idof_MixedObj() >>> 0;
    },
    __set_MixedObj_wasmFn(obj, val) {
      // assembly/generated/__set_MixedObj_wasmFn(assembly/generated/MixedObj, assembly/generated/Closure) => void
      obj = __retain(__lowerRecord8(obj) || __notnull());
      val = __lowerInternref(val) || __notnull();
      try {
        exports.__set_MixedObj_wasmFn(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_MixedObj_wasmFn(obj) {
      // assembly/generated/__get_MixedObj_wasmFn(assembly/generated/MixedObj) => assembly/generated/Closure
      obj = __lowerRecord8(obj) || __notnull();
      return __liftInternref(exports.__get_MixedObj_wasmFn(obj) >>> 0);
    },
    __set_MixedObj_jsFn(obj, val) {
      // assembly/generated/__set_MixedObj_jsFn(assembly/generated/MixedObj, assembly/generated/Closure) => void
      obj = __retain(__lowerRecord8(obj) || __notnull());
      val = __lowerInternref(val) || __notnull();
      try {
        exports.__set_MixedObj_jsFn(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_MixedObj_jsFn(obj) {
      // assembly/generated/__get_MixedObj_jsFn(assembly/generated/MixedObj) => assembly/generated/Closure
      obj = __lowerRecord8(obj) || __notnull();
      return __liftInternref(exports.__get_MixedObj_jsFn(obj) >>> 0);
    },
    __new_Matrix() {
      // assembly/generated/__new_Matrix() => assembly/generated/Matrix
      return __liftRecord9(exports.__new_Matrix() >>> 0);
    },
    __idof_Matrix() {
      // assembly/generated/__idof_Matrix() => u32
      return exports.__idof_Matrix() >>> 0;
    },
    __set_Matrix_rows(obj, val) {
      // assembly/generated/__set_Matrix_rows(assembly/generated/Matrix, f64) => void
      obj = __lowerRecord9(obj) || __notnull();
      exports.__set_Matrix_rows(obj, val);
    },
    __get_Matrix_rows(obj) {
      // assembly/generated/__get_Matrix_rows(assembly/generated/Matrix) => f64
      obj = __lowerRecord9(obj) || __notnull();
      return exports.__get_Matrix_rows(obj);
    },
    __set_Matrix_cols(obj, val) {
      // assembly/generated/__set_Matrix_cols(assembly/generated/Matrix, f64) => void
      obj = __lowerRecord9(obj) || __notnull();
      exports.__set_Matrix_cols(obj, val);
    },
    __get_Matrix_cols(obj) {
      // assembly/generated/__get_Matrix_cols(assembly/generated/Matrix) => f64
      obj = __lowerRecord9(obj) || __notnull();
      return exports.__get_Matrix_cols(obj);
    },
    __set_Matrix_data(obj, val) {
      // assembly/generated/__set_Matrix_data(assembly/generated/Matrix, ~lib/array/Array<f64>) => void
      obj = __retain(__lowerRecord9(obj) || __notnull());
      val = __lowerArray(__setF64, 7, 3, val) || __notnull();
      try {
        exports.__set_Matrix_data(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Matrix_data(obj) {
      // assembly/generated/__get_Matrix_data(assembly/generated/Matrix) => ~lib/array/Array<f64>
      obj = __lowerRecord9(obj) || __notnull();
      return __liftArray(__getF64, 3, exports.__get_Matrix_data(obj) >>> 0);
    },
    __new_Point() {
      // assembly/generated/__new_Point() => assembly/generated/Point
      return __liftRecord10(exports.__new_Point() >>> 0);
    },
    __idof_Point() {
      // assembly/generated/__idof_Point() => u32
      return exports.__idof_Point() >>> 0;
    },
    __set_Point_x(obj, val) {
      // assembly/generated/__set_Point_x(assembly/generated/Point, f64) => void
      obj = __lowerRecord10(obj) || __notnull();
      exports.__set_Point_x(obj, val);
    },
    __get_Point_x(obj) {
      // assembly/generated/__get_Point_x(assembly/generated/Point) => f64
      obj = __lowerRecord10(obj) || __notnull();
      return exports.__get_Point_x(obj);
    },
    __set_Point_y(obj, val) {
      // assembly/generated/__set_Point_y(assembly/generated/Point, f64) => void
      obj = __lowerRecord10(obj) || __notnull();
      exports.__set_Point_y(obj, val);
    },
    __get_Point_y(obj) {
      // assembly/generated/__get_Point_y(assembly/generated/Point) => f64
      obj = __lowerRecord10(obj) || __notnull();
      return exports.__get_Point_y(obj);
    },
    __new_Inner() {
      // assembly/generated/__new_Inner() => assembly/generated/Inner
      return __liftRecord11(exports.__new_Inner() >>> 0);
    },
    __idof_Inner() {
      // assembly/generated/__idof_Inner() => u32
      return exports.__idof_Inner() >>> 0;
    },
    __set_Inner_val(obj, val) {
      // assembly/generated/__set_Inner_val(assembly/generated/Inner, f64) => void
      obj = __lowerRecord11(obj) || __notnull();
      exports.__set_Inner_val(obj, val);
    },
    __get_Inner_val(obj) {
      // assembly/generated/__get_Inner_val(assembly/generated/Inner) => f64
      obj = __lowerRecord11(obj) || __notnull();
      return exports.__get_Inner_val(obj);
    },
    __new_Outer() {
      // assembly/generated/__new_Outer() => assembly/generated/Outer
      return __liftRecord12(exports.__new_Outer() >>> 0);
    },
    __idof_Outer() {
      // assembly/generated/__idof_Outer() => u32
      return exports.__idof_Outer() >>> 0;
    },
    __set_Outer_name(obj, val) {
      // assembly/generated/__set_Outer_name(assembly/generated/Outer, ~lib/string/String) => void
      obj = __retain(__lowerRecord12(obj) || __notnull());
      val = __lowerString(val) || __notnull();
      try {
        exports.__set_Outer_name(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Outer_name(obj) {
      // assembly/generated/__get_Outer_name(assembly/generated/Outer) => ~lib/string/String
      obj = __lowerRecord12(obj) || __notnull();
      return __liftString(exports.__get_Outer_name(obj) >>> 0);
    },
    __set_Outer_inner(obj, val) {
      // assembly/generated/__set_Outer_inner(assembly/generated/Outer, assembly/generated/Inner) => void
      obj = __retain(__lowerRecord12(obj) || __notnull());
      val = __lowerRecord11(val) || __notnull();
      try {
        exports.__set_Outer_inner(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Outer_inner(obj) {
      // assembly/generated/__get_Outer_inner(assembly/generated/Outer) => assembly/generated/Inner
      obj = __lowerRecord12(obj) || __notnull();
      return __liftRecord11(exports.__get_Outer_inner(obj) >>> 0);
    },
    __set_Outer_list(obj, val) {
      // assembly/generated/__set_Outer_list(assembly/generated/Outer, ~lib/array/Array<f64>) => void
      obj = __retain(__lowerRecord12(obj) || __notnull());
      val = __lowerArray(__setF64, 7, 3, val) || __notnull();
      try {
        exports.__set_Outer_list(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Outer_list(obj) {
      // assembly/generated/__get_Outer_list(assembly/generated/Outer) => ~lib/array/Array<f64>
      obj = __lowerRecord12(obj) || __notnull();
      return __liftArray(__getF64, 3, exports.__get_Outer_list(obj) >>> 0);
    },
    __new_Rect() {
      // assembly/generated/__new_Rect() => assembly/generated/Rect
      return __liftInternref(exports.__new_Rect() >>> 0);
    },
    __idof_Rect() {
      // assembly/generated/__idof_Rect() => u32
      return exports.__idof_Rect() >>> 0;
    },
    __set_Rect_x(obj, val) {
      // assembly/generated/__set_Rect_x(assembly/generated/Rect, f64) => void
      obj = __lowerInternref(obj) || __notnull();
      exports.__set_Rect_x(obj, val);
    },
    __get_Rect_x(obj) {
      // assembly/generated/__get_Rect_x(assembly/generated/Rect) => f64
      obj = __lowerInternref(obj) || __notnull();
      return exports.__get_Rect_x(obj);
    },
    __set_Rect_y(obj, val) {
      // assembly/generated/__set_Rect_y(assembly/generated/Rect, f64) => void
      obj = __lowerInternref(obj) || __notnull();
      exports.__set_Rect_y(obj, val);
    },
    __get_Rect_y(obj) {
      // assembly/generated/__get_Rect_y(assembly/generated/Rect) => f64
      obj = __lowerInternref(obj) || __notnull();
      return exports.__get_Rect_y(obj);
    },
    __set_Rect_width(obj, val) {
      // assembly/generated/__set_Rect_width(assembly/generated/Rect, f64) => void
      obj = __lowerInternref(obj) || __notnull();
      exports.__set_Rect_width(obj, val);
    },
    __get_Rect_width(obj) {
      // assembly/generated/__get_Rect_width(assembly/generated/Rect) => f64
      obj = __lowerInternref(obj) || __notnull();
      return exports.__get_Rect_width(obj);
    },
    __set_Rect_height(obj, val) {
      // assembly/generated/__set_Rect_height(assembly/generated/Rect, f64) => void
      obj = __lowerInternref(obj) || __notnull();
      exports.__set_Rect_height(obj, val);
    },
    __get_Rect_height(obj) {
      // assembly/generated/__get_Rect_height(assembly/generated/Rect) => f64
      obj = __lowerInternref(obj) || __notnull();
      return exports.__get_Rect_height(obj);
    },
  }, exports);
  function __liftRecord5(pointer) {
    // assembly/generated/NestedObj
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      val: __getF64(pointer + 0),
      fn: __liftInternref(__getU32(pointer + 8)),
    };
  }
  function __lowerRecord5(value) {
    // assembly/generated/NestedObj
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(12, 5));
    __setF64(pointer + 0, value.val);
    __setU32(pointer + 8, __lowerInternref(value.fn) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord6(pointer) {
    // assembly/generated/ComplexObj
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      id: __getF64(pointer + 0),
      list: __liftArray(__getF64, 3, __getU32(pointer + 8)),
      nested: __liftRecord5(__getU32(pointer + 12)),
      processor: __liftInternref(__getU32(pointer + 16)),
    };
  }
  function __lowerRecord6(value) {
    // assembly/generated/ComplexObj
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(20, 6));
    __setF64(pointer + 0, value.id);
    __setU32(pointer + 8, __lowerArray(__setF64, 7, 3, value.list) || __notnull());
    __setU32(pointer + 12, __lowerRecord5(value.nested) || __notnull());
    __setU32(pointer + 16, __lowerInternref(value.processor) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord8(pointer) {
    // assembly/generated/MixedObj
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      wasmFn: __liftInternref(__getU32(pointer + 0)),
      jsFn: __liftInternref(__getU32(pointer + 4)),
    };
  }
  function __lowerRecord8(value) {
    // assembly/generated/MixedObj
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(8, 8));
    __setU32(pointer + 0, __lowerInternref(value.wasmFn) || __notnull());
    __setU32(pointer + 4, __lowerInternref(value.jsFn) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord9(pointer) {
    // assembly/generated/Matrix
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      rows: __getF64(pointer + 0),
      cols: __getF64(pointer + 8),
      data: __liftArray(__getF64, 3, __getU32(pointer + 16)),
    };
  }
  function __lowerRecord9(value) {
    // assembly/generated/Matrix
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(20, 9));
    __setF64(pointer + 0, value.rows);
    __setF64(pointer + 8, value.cols);
    __setU32(pointer + 16, __lowerArray(__setF64, 7, 3, value.data) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord10(pointer) {
    // assembly/generated/Point
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      x: __getF64(pointer + 0),
      y: __getF64(pointer + 8),
    };
  }
  function __lowerRecord10(value) {
    // assembly/generated/Point
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(16, 10));
    __setF64(pointer + 0, value.x);
    __setF64(pointer + 8, value.y);
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord11(pointer) {
    // assembly/generated/Inner
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      val: __getF64(pointer + 0),
    };
  }
  function __lowerRecord11(value) {
    // assembly/generated/Inner
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(8, 11));
    __setF64(pointer + 0, value.val);
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord12(pointer) {
    // assembly/generated/Outer
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      name: __liftString(__getU32(pointer + 0)),
      inner: __liftRecord11(__getU32(pointer + 4)),
      list: __liftArray(__getF64, 3, __getU32(pointer + 8)),
    };
  }
  function __lowerRecord12(value) {
    // assembly/generated/Outer
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(12, 12));
    __setU32(pointer + 0, __lowerString(value.name) || __notnull());
    __setU32(pointer + 4, __lowerRecord11(value.inner) || __notnull());
    __setU32(pointer + 8, __lowerArray(__setF64, 7, 3, value.list) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __lowerString(value) {
    if (value == null) return 0;
    const
      length = value.length,
      pointer = exports.__new(length << 1, 2) >>> 0,
      memoryU16 = new Uint16Array(memory.buffer);
    for (let i = 0; i < length; ++i) memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  function __liftArray(liftElement, align, pointer) {
    if (!pointer) return null;
    const
      dataStart = __getU32(pointer + 4),
      length = __dataview.getUint32(pointer + 12, true),
      values = new Array(length);
    for (let i = 0; i < length; ++i) values[i] = liftElement(dataStart + (i << align >>> 0));
    return values;
  }
  function __lowerArray(lowerElement, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
      header = exports.__pin(exports.__new(16, id)) >>> 0;
    __setU32(header + 0, buffer);
    __dataview.setUint32(header + 4, buffer, true);
    __dataview.setUint32(header + 8, length << align, true);
    __dataview.setUint32(header + 12, length, true);
    for (let i = 0; i < length; ++i) lowerElement(buffer + (i << align >>> 0), values[i]);
    exports.__unpin(buffer);
    exports.__unpin(header);
    return header;
  }
  class Internref extends Number {}
  const registry = new FinalizationRegistry(__release);
  function __liftInternref(pointer) {
    if (!pointer) return null;
    const sentinel = new Internref(__retain(pointer));
    registry.register(sentinel, pointer);
    return sentinel;
  }
  function __lowerInternref(value) {
    if (value == null) return 0;
    if (value instanceof Internref) return value.valueOf();
    throw TypeError("internref expected");
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  let __dataview = new DataView(memory.buffer);
  function __setU32(pointer, value) {
    try {
      __dataview.setUint32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint32(pointer, value, true);
    }
  }
  function __setF64(pointer, value) {
    try {
      __dataview.setFloat64(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setFloat64(pointer, value, true);
    }
  }
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  function __getF64(pointer) {
    try {
      return __dataview.getFloat64(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getFloat64(pointer, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  table,
  __new,
  __pin,
  __unpin,
  __collect,
  __rtti_base,
  __new_Closure,
  __get_Closure_index,
  __get_Closure_env,
  __get_Closure_type,
  globalX,
  __new_NestedObj,
  __idof_NestedObj,
  __set_NestedObj_val,
  __get_NestedObj_val,
  __set_NestedObj_fn,
  __get_NestedObj_fn,
  __new_ComplexObj,
  __idof_ComplexObj,
  __set_ComplexObj_id,
  __get_ComplexObj_id,
  __set_ComplexObj_list,
  __get_ComplexObj_list,
  __set_ComplexObj_nested,
  __get_ComplexObj_nested,
  __set_ComplexObj_processor,
  __get_ComplexObj_processor,
  __new_MixedObj,
  __idof_MixedObj,
  __set_MixedObj_wasmFn,
  __get_MixedObj_wasmFn,
  __set_MixedObj_jsFn,
  __get_MixedObj_jsFn,
  __new_Matrix,
  __idof_Matrix,
  __set_Matrix_rows,
  __get_Matrix_rows,
  __set_Matrix_cols,
  __get_Matrix_cols,
  __set_Matrix_data,
  __get_Matrix_data,
  __new_Point,
  __idof_Point,
  __set_Point_x,
  __get_Point_x,
  __set_Point_y,
  __get_Point_y,
  __new_Inner,
  __idof_Inner,
  __set_Inner_val,
  __get_Inner_val,
  __new_Outer,
  __idof_Outer,
  __set_Outer_name,
  __get_Outer_name,
  __set_Outer_inner,
  __get_Outer_inner,
  __set_Outer_list,
  __get_Outer_list,
  __new_Rect,
  __idof_Rect,
  __set_Rect_x,
  __get_Rect_x,
  __set_Rect_y,
  __get_Rect_y,
  __set_Rect_width,
  __get_Rect_width,
  __set_Rect_height,
  __get_Rect_height,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("jsw.wasm", import.meta.url));
