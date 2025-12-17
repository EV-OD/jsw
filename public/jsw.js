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
    __new_Matrix() {
      // assembly/generated/__new_Matrix() => assembly/generated/Matrix
      return __liftRecord4(exports.__new_Matrix() >>> 0);
    },
    __idof_Matrix() {
      // assembly/generated/__idof_Matrix() => u32
      return exports.__idof_Matrix() >>> 0;
    },
    __set_Matrix_rows(obj, val) {
      // assembly/generated/__set_Matrix_rows(assembly/generated/Matrix, f64) => void
      obj = __lowerRecord4(obj) || __notnull();
      exports.__set_Matrix_rows(obj, val);
    },
    __get_Matrix_rows(obj) {
      // assembly/generated/__get_Matrix_rows(assembly/generated/Matrix) => f64
      obj = __lowerRecord4(obj) || __notnull();
      return exports.__get_Matrix_rows(obj);
    },
    __set_Matrix_cols(obj, val) {
      // assembly/generated/__set_Matrix_cols(assembly/generated/Matrix, f64) => void
      obj = __lowerRecord4(obj) || __notnull();
      exports.__set_Matrix_cols(obj, val);
    },
    __get_Matrix_cols(obj) {
      // assembly/generated/__get_Matrix_cols(assembly/generated/Matrix) => f64
      obj = __lowerRecord4(obj) || __notnull();
      return exports.__get_Matrix_cols(obj);
    },
    __set_Matrix_data(obj, val) {
      // assembly/generated/__set_Matrix_data(assembly/generated/Matrix, ~lib/array/Array<f64>) => void
      obj = __retain(__lowerRecord4(obj) || __notnull());
      val = __lowerArray(__setF64, 5, 3, val) || __notnull();
      try {
        exports.__set_Matrix_data(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Matrix_data(obj) {
      // assembly/generated/__get_Matrix_data(assembly/generated/Matrix) => ~lib/array/Array<f64>
      obj = __lowerRecord4(obj) || __notnull();
      return __liftArray(__getF64, 3, exports.__get_Matrix_data(obj) >>> 0);
    },
    __new_Point() {
      // assembly/generated/__new_Point() => assembly/generated/Point
      return __liftRecord6(exports.__new_Point() >>> 0);
    },
    __idof_Point() {
      // assembly/generated/__idof_Point() => u32
      return exports.__idof_Point() >>> 0;
    },
    __set_Point_x(obj, val) {
      // assembly/generated/__set_Point_x(assembly/generated/Point, f64) => void
      obj = __lowerRecord6(obj) || __notnull();
      exports.__set_Point_x(obj, val);
    },
    __get_Point_x(obj) {
      // assembly/generated/__get_Point_x(assembly/generated/Point) => f64
      obj = __lowerRecord6(obj) || __notnull();
      return exports.__get_Point_x(obj);
    },
    __set_Point_y(obj, val) {
      // assembly/generated/__set_Point_y(assembly/generated/Point, f64) => void
      obj = __lowerRecord6(obj) || __notnull();
      exports.__set_Point_y(obj, val);
    },
    __get_Point_y(obj) {
      // assembly/generated/__get_Point_y(assembly/generated/Point) => f64
      obj = __lowerRecord6(obj) || __notnull();
      return exports.__get_Point_y(obj);
    },
    __new_Inner() {
      // assembly/generated/__new_Inner() => assembly/generated/Inner
      return __liftRecord7(exports.__new_Inner() >>> 0);
    },
    __idof_Inner() {
      // assembly/generated/__idof_Inner() => u32
      return exports.__idof_Inner() >>> 0;
    },
    __set_Inner_val(obj, val) {
      // assembly/generated/__set_Inner_val(assembly/generated/Inner, f64) => void
      obj = __lowerRecord7(obj) || __notnull();
      exports.__set_Inner_val(obj, val);
    },
    __get_Inner_val(obj) {
      // assembly/generated/__get_Inner_val(assembly/generated/Inner) => f64
      obj = __lowerRecord7(obj) || __notnull();
      return exports.__get_Inner_val(obj);
    },
    __new_Outer() {
      // assembly/generated/__new_Outer() => assembly/generated/Outer
      return __liftRecord8(exports.__new_Outer() >>> 0);
    },
    __idof_Outer() {
      // assembly/generated/__idof_Outer() => u32
      return exports.__idof_Outer() >>> 0;
    },
    __set_Outer_name(obj, val) {
      // assembly/generated/__set_Outer_name(assembly/generated/Outer, ~lib/string/String) => void
      obj = __retain(__lowerRecord8(obj) || __notnull());
      val = __lowerString(val) || __notnull();
      try {
        exports.__set_Outer_name(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Outer_name(obj) {
      // assembly/generated/__get_Outer_name(assembly/generated/Outer) => ~lib/string/String
      obj = __lowerRecord8(obj) || __notnull();
      return __liftString(exports.__get_Outer_name(obj) >>> 0);
    },
    __set_Outer_inner(obj, val) {
      // assembly/generated/__set_Outer_inner(assembly/generated/Outer, assembly/generated/Inner) => void
      obj = __retain(__lowerRecord8(obj) || __notnull());
      val = __lowerRecord7(val) || __notnull();
      try {
        exports.__set_Outer_inner(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Outer_inner(obj) {
      // assembly/generated/__get_Outer_inner(assembly/generated/Outer) => assembly/generated/Inner
      obj = __lowerRecord8(obj) || __notnull();
      return __liftRecord7(exports.__get_Outer_inner(obj) >>> 0);
    },
    __set_Outer_list(obj, val) {
      // assembly/generated/__set_Outer_list(assembly/generated/Outer, ~lib/array/Array<f64>) => void
      obj = __retain(__lowerRecord8(obj) || __notnull());
      val = __lowerArray(__setF64, 5, 3, val) || __notnull();
      try {
        exports.__set_Outer_list(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Outer_list(obj) {
      // assembly/generated/__get_Outer_list(assembly/generated/Outer) => ~lib/array/Array<f64>
      obj = __lowerRecord8(obj) || __notnull();
      return __liftArray(__getF64, 3, exports.__get_Outer_list(obj) >>> 0);
    },
    __idof_Array_f64_() {
      // assembly/generated/__idof_Array_f64_() => u32
      return exports.__idof_Array_f64_() >>> 0;
    },
  }, exports);
  function __liftRecord4(pointer) {
    // assembly/generated/Matrix
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      rows: __getF64(pointer + 0),
      cols: __getF64(pointer + 8),
      data: __liftArray(__getF64, 3, __getU32(pointer + 16)),
    };
  }
  function __lowerRecord4(value) {
    // assembly/generated/Matrix
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(20, 4));
    __setF64(pointer + 0, value.rows);
    __setF64(pointer + 8, value.cols);
    __setU32(pointer + 16, __lowerArray(__setF64, 5, 3, value.data) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord6(pointer) {
    // assembly/generated/Point
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      x: __getF64(pointer + 0),
      y: __getF64(pointer + 8),
    };
  }
  function __lowerRecord6(value) {
    // assembly/generated/Point
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(16, 6));
    __setF64(pointer + 0, value.x);
    __setF64(pointer + 8, value.y);
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord7(pointer) {
    // assembly/generated/Inner
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      val: __getF64(pointer + 0),
    };
  }
  function __lowerRecord7(value) {
    // assembly/generated/Inner
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(8, 7));
    __setF64(pointer + 0, value.val);
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord8(pointer) {
    // assembly/generated/Outer
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      name: __liftString(__getU32(pointer + 0)),
      inner: __liftRecord7(__getU32(pointer + 4)),
      list: __liftArray(__getF64, 3, __getU32(pointer + 8)),
    };
  }
  function __lowerRecord8(value) {
    // assembly/generated/Outer
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(12, 8));
    __setU32(pointer + 0, __lowerString(value.name) || __notnull());
    __setU32(pointer + 4, __lowerRecord7(value.inner) || __notnull());
    __setU32(pointer + 8, __lowerArray(__setF64, 5, 3, value.list) || __notnull());
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
  __new,
  __pin,
  __unpin,
  __collect,
  __rtti_base,
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
  __idof_Array_f64_,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("jsw.wasm", import.meta.url));
