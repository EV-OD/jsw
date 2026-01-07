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
      consoleLog(s) {
        // assembly/generated/__consoleLogString(~lib/string/String) => void
        s = __liftString(s >>> 0);
        consoleLog(s);
      },
      __invoke_cb(fnIndex, arg0) {
        // assembly/generated/__invoke_cb(u32, f64) => f64
        fnIndex = fnIndex >>> 0;
        return __invoke_cb(fnIndex, arg0);
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
    __js_callback_createComplex_0_index: {
      // assembly/generated/__js_callback_createComplex_0_index: u32
      valueOf() { return this.value; },
      get value() {
        return exports.__js_callback_createComplex_0_index.value >>> 0;
      },
      set value(value) {
        exports.__js_callback_createComplex_0_index.value = value;
      }
    },
    __js_callback_createComplex_1_index: {
      // assembly/generated/__js_callback_createComplex_1_index: u32
      valueOf() { return this.value; },
      get value() {
        return exports.__js_callback_createComplex_1_index.value >>> 0;
      },
      set value(value) {
        exports.__js_callback_createComplex_1_index.value = value;
      }
    },
    __js_callback_createMixed_0_index: {
      // assembly/generated/__js_callback_createMixed_0_index: u32
      valueOf() { return this.value; },
      get value() {
        return exports.__js_callback_createMixed_0_index.value >>> 0;
      },
      set value(value) {
        exports.__js_callback_createMixed_0_index.value = value;
      }
    },
    __js_callback_createMixed_1_index: {
      // assembly/generated/__js_callback_createMixed_1_index: u32
      valueOf() { return this.value; },
      get value() {
        return exports.__js_callback_createMixed_1_index.value >>> 0;
      },
      set value(value) {
        exports.__js_callback_createMixed_1_index.value = value;
      }
    },
    __new_Model() {
      // assembly/generated/__new_Model() => assembly/generated/Model
      return __liftInternref(exports.__new_Model() >>> 0);
    },
    __idof_Model() {
      // assembly/generated/__idof_Model() => u32
      return exports.__idof_Model() >>> 0;
    },
    __set_Model_weights(obj, val) {
      // assembly/generated/__set_Model_weights(assembly/generated/Model, ~lib/array/Array<~lib/array/Array<~lib/array/Array<f64>>>) => void
      obj = __retain(__lowerInternref(obj) || __notnull());
      val = __lowerArray((pointer, value) => { __setU32(pointer, __lowerArray((pointer, value) => { __setU32(pointer, __lowerArray(__setF64, 6, 3, value) || __notnull()); }, 7, 2, value) || __notnull()); }, 8, 2, val) || __notnull();
      try {
        exports.__set_Model_weights(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Model_weights(obj) {
      // assembly/generated/__get_Model_weights(assembly/generated/Model) => ~lib/array/Array<~lib/array/Array<~lib/array/Array<f64>>>
      obj = __lowerInternref(obj) || __notnull();
      return __liftArray(pointer => __liftArray(pointer => __liftArray(__getF64, 3, __getU32(pointer)), 2, __getU32(pointer)), 2, exports.__get_Model_weights(obj) >>> 0);
    },
    __set_Model_biases(obj, val) {
      // assembly/generated/__set_Model_biases(assembly/generated/Model, ~lib/array/Array<~lib/array/Array<f64>>) => void
      obj = __retain(__lowerInternref(obj) || __notnull());
      val = __lowerArray((pointer, value) => { __setU32(pointer, __lowerArray(__setF64, 6, 3, value) || __notnull()); }, 7, 2, val) || __notnull();
      try {
        exports.__set_Model_biases(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Model_biases(obj) {
      // assembly/generated/__get_Model_biases(assembly/generated/Model) => ~lib/array/Array<~lib/array/Array<f64>>
      obj = __lowerInternref(obj) || __notnull();
      return __liftArray(pointer => __liftArray(__getF64, 3, __getU32(pointer)), 2, exports.__get_Model_biases(obj) >>> 0);
    },
    __new_NestedObj() {
      // assembly/generated/__new_NestedObj() => assembly/generated/NestedObj
      return __liftRecord9(exports.__new_NestedObj() >>> 0);
    },
    __idof_NestedObj() {
      // assembly/generated/__idof_NestedObj() => u32
      return exports.__idof_NestedObj() >>> 0;
    },
    __set_NestedObj_val(obj, val) {
      // assembly/generated/__set_NestedObj_val(assembly/generated/NestedObj, f64) => void
      obj = __lowerRecord9(obj) || __notnull();
      exports.__set_NestedObj_val(obj, val);
    },
    __get_NestedObj_val(obj) {
      // assembly/generated/__get_NestedObj_val(assembly/generated/NestedObj) => f64
      obj = __lowerRecord9(obj) || __notnull();
      return exports.__get_NestedObj_val(obj);
    },
    __set_NestedObj_fn(obj, val) {
      // assembly/generated/__set_NestedObj_fn(assembly/generated/NestedObj, assembly/generated/Closure) => void
      obj = __retain(__lowerRecord9(obj) || __notnull());
      val = __lowerInternref(val) || __notnull();
      try {
        exports.__set_NestedObj_fn(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_NestedObj_fn(obj) {
      // assembly/generated/__get_NestedObj_fn(assembly/generated/NestedObj) => assembly/generated/Closure
      obj = __lowerRecord9(obj) || __notnull();
      return __liftInternref(exports.__get_NestedObj_fn(obj) >>> 0);
    },
    __new_ComplexObj() {
      // assembly/generated/__new_ComplexObj() => assembly/generated/ComplexObj
      return __liftRecord10(exports.__new_ComplexObj() >>> 0);
    },
    __idof_ComplexObj() {
      // assembly/generated/__idof_ComplexObj() => u32
      return exports.__idof_ComplexObj() >>> 0;
    },
    __set_ComplexObj_id(obj, val) {
      // assembly/generated/__set_ComplexObj_id(assembly/generated/ComplexObj, f64) => void
      obj = __lowerRecord10(obj) || __notnull();
      exports.__set_ComplexObj_id(obj, val);
    },
    __get_ComplexObj_id(obj) {
      // assembly/generated/__get_ComplexObj_id(assembly/generated/ComplexObj) => f64
      obj = __lowerRecord10(obj) || __notnull();
      return exports.__get_ComplexObj_id(obj);
    },
    __set_ComplexObj_list(obj, val) {
      // assembly/generated/__set_ComplexObj_list(assembly/generated/ComplexObj, ~lib/array/Array<f64>) => void
      obj = __retain(__lowerRecord10(obj) || __notnull());
      val = __lowerArray(__setF64, 6, 3, val) || __notnull();
      try {
        exports.__set_ComplexObj_list(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_ComplexObj_list(obj) {
      // assembly/generated/__get_ComplexObj_list(assembly/generated/ComplexObj) => ~lib/array/Array<f64>
      obj = __lowerRecord10(obj) || __notnull();
      return __liftArray(__getF64, 3, exports.__get_ComplexObj_list(obj) >>> 0);
    },
    __set_ComplexObj_nested(obj, val) {
      // assembly/generated/__set_ComplexObj_nested(assembly/generated/ComplexObj, assembly/generated/NestedObj) => void
      obj = __retain(__lowerRecord10(obj) || __notnull());
      val = __lowerRecord9(val) || __notnull();
      try {
        exports.__set_ComplexObj_nested(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_ComplexObj_nested(obj) {
      // assembly/generated/__get_ComplexObj_nested(assembly/generated/ComplexObj) => assembly/generated/NestedObj
      obj = __lowerRecord10(obj) || __notnull();
      return __liftRecord9(exports.__get_ComplexObj_nested(obj) >>> 0);
    },
    __set_ComplexObj_processor(obj, val) {
      // assembly/generated/__set_ComplexObj_processor(assembly/generated/ComplexObj, assembly/generated/Closure) => void
      obj = __retain(__lowerRecord10(obj) || __notnull());
      val = __lowerInternref(val) || __notnull();
      try {
        exports.__set_ComplexObj_processor(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_ComplexObj_processor(obj) {
      // assembly/generated/__get_ComplexObj_processor(assembly/generated/ComplexObj) => assembly/generated/Closure
      obj = __lowerRecord10(obj) || __notnull();
      return __liftInternref(exports.__get_ComplexObj_processor(obj) >>> 0);
    },
    __new_MixedObj() {
      // assembly/generated/__new_MixedObj() => assembly/generated/MixedObj
      return __liftRecord11(exports.__new_MixedObj() >>> 0);
    },
    __idof_MixedObj() {
      // assembly/generated/__idof_MixedObj() => u32
      return exports.__idof_MixedObj() >>> 0;
    },
    __set_MixedObj_wasmFn(obj, val) {
      // assembly/generated/__set_MixedObj_wasmFn(assembly/generated/MixedObj, assembly/generated/Closure) => void
      obj = __retain(__lowerRecord11(obj) || __notnull());
      val = __lowerInternref(val) || __notnull();
      try {
        exports.__set_MixedObj_wasmFn(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_MixedObj_wasmFn(obj) {
      // assembly/generated/__get_MixedObj_wasmFn(assembly/generated/MixedObj) => assembly/generated/Closure
      obj = __lowerRecord11(obj) || __notnull();
      return __liftInternref(exports.__get_MixedObj_wasmFn(obj) >>> 0);
    },
    __set_MixedObj_jsFn(obj, val) {
      // assembly/generated/__set_MixedObj_jsFn(assembly/generated/MixedObj, assembly/generated/Closure) => void
      obj = __retain(__lowerRecord11(obj) || __notnull());
      val = __lowerInternref(val) || __notnull();
      try {
        exports.__set_MixedObj_jsFn(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_MixedObj_jsFn(obj) {
      // assembly/generated/__get_MixedObj_jsFn(assembly/generated/MixedObj) => assembly/generated/Closure
      obj = __lowerRecord11(obj) || __notnull();
      return __liftInternref(exports.__get_MixedObj_jsFn(obj) >>> 0);
    },
    __new_Matrix() {
      // assembly/generated/__new_Matrix() => assembly/generated/Matrix
      return __liftRecord12(exports.__new_Matrix() >>> 0);
    },
    __idof_Matrix() {
      // assembly/generated/__idof_Matrix() => u32
      return exports.__idof_Matrix() >>> 0;
    },
    __set_Matrix_rows(obj, val) {
      // assembly/generated/__set_Matrix_rows(assembly/generated/Matrix, f64) => void
      obj = __lowerRecord12(obj) || __notnull();
      exports.__set_Matrix_rows(obj, val);
    },
    __get_Matrix_rows(obj) {
      // assembly/generated/__get_Matrix_rows(assembly/generated/Matrix) => f64
      obj = __lowerRecord12(obj) || __notnull();
      return exports.__get_Matrix_rows(obj);
    },
    __set_Matrix_cols(obj, val) {
      // assembly/generated/__set_Matrix_cols(assembly/generated/Matrix, f64) => void
      obj = __lowerRecord12(obj) || __notnull();
      exports.__set_Matrix_cols(obj, val);
    },
    __get_Matrix_cols(obj) {
      // assembly/generated/__get_Matrix_cols(assembly/generated/Matrix) => f64
      obj = __lowerRecord12(obj) || __notnull();
      return exports.__get_Matrix_cols(obj);
    },
    __set_Matrix_data(obj, val) {
      // assembly/generated/__set_Matrix_data(assembly/generated/Matrix, ~lib/array/Array<f64>) => void
      obj = __retain(__lowerRecord12(obj) || __notnull());
      val = __lowerArray(__setF64, 6, 3, val) || __notnull();
      try {
        exports.__set_Matrix_data(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Matrix_data(obj) {
      // assembly/generated/__get_Matrix_data(assembly/generated/Matrix) => ~lib/array/Array<f64>
      obj = __lowerRecord12(obj) || __notnull();
      return __liftArray(__getF64, 3, exports.__get_Matrix_data(obj) >>> 0);
    },
    __new_Point() {
      // assembly/generated/__new_Point() => assembly/generated/Point
      return __liftRecord13(exports.__new_Point() >>> 0);
    },
    __idof_Point() {
      // assembly/generated/__idof_Point() => u32
      return exports.__idof_Point() >>> 0;
    },
    __set_Point_x(obj, val) {
      // assembly/generated/__set_Point_x(assembly/generated/Point, f64) => void
      obj = __lowerRecord13(obj) || __notnull();
      exports.__set_Point_x(obj, val);
    },
    __get_Point_x(obj) {
      // assembly/generated/__get_Point_x(assembly/generated/Point) => f64
      obj = __lowerRecord13(obj) || __notnull();
      return exports.__get_Point_x(obj);
    },
    __set_Point_y(obj, val) {
      // assembly/generated/__set_Point_y(assembly/generated/Point, f64) => void
      obj = __lowerRecord13(obj) || __notnull();
      exports.__set_Point_y(obj, val);
    },
    __get_Point_y(obj) {
      // assembly/generated/__get_Point_y(assembly/generated/Point) => f64
      obj = __lowerRecord13(obj) || __notnull();
      return exports.__get_Point_y(obj);
    },
    __new_Inner() {
      // assembly/generated/__new_Inner() => assembly/generated/Inner
      return __liftRecord14(exports.__new_Inner() >>> 0);
    },
    __idof_Inner() {
      // assembly/generated/__idof_Inner() => u32
      return exports.__idof_Inner() >>> 0;
    },
    __set_Inner_val(obj, val) {
      // assembly/generated/__set_Inner_val(assembly/generated/Inner, f64) => void
      obj = __lowerRecord14(obj) || __notnull();
      exports.__set_Inner_val(obj, val);
    },
    __get_Inner_val(obj) {
      // assembly/generated/__get_Inner_val(assembly/generated/Inner) => f64
      obj = __lowerRecord14(obj) || __notnull();
      return exports.__get_Inner_val(obj);
    },
    __new_Outer() {
      // assembly/generated/__new_Outer() => assembly/generated/Outer
      return __liftRecord15(exports.__new_Outer() >>> 0);
    },
    __idof_Outer() {
      // assembly/generated/__idof_Outer() => u32
      return exports.__idof_Outer() >>> 0;
    },
    __set_Outer_name(obj, val) {
      // assembly/generated/__set_Outer_name(assembly/generated/Outer, ~lib/string/String) => void
      obj = __retain(__lowerRecord15(obj) || __notnull());
      val = __lowerString(val) || __notnull();
      try {
        exports.__set_Outer_name(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Outer_name(obj) {
      // assembly/generated/__get_Outer_name(assembly/generated/Outer) => ~lib/string/String
      obj = __lowerRecord15(obj) || __notnull();
      return __liftString(exports.__get_Outer_name(obj) >>> 0);
    },
    __set_Outer_inner(obj, val) {
      // assembly/generated/__set_Outer_inner(assembly/generated/Outer, assembly/generated/Inner) => void
      obj = __retain(__lowerRecord15(obj) || __notnull());
      val = __lowerRecord14(val) || __notnull();
      try {
        exports.__set_Outer_inner(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Outer_inner(obj) {
      // assembly/generated/__get_Outer_inner(assembly/generated/Outer) => assembly/generated/Inner
      obj = __lowerRecord15(obj) || __notnull();
      return __liftRecord14(exports.__get_Outer_inner(obj) >>> 0);
    },
    __set_Outer_list(obj, val) {
      // assembly/generated/__set_Outer_list(assembly/generated/Outer, ~lib/array/Array<f64>) => void
      obj = __retain(__lowerRecord15(obj) || __notnull());
      val = __lowerArray(__setF64, 6, 3, val) || __notnull();
      try {
        exports.__set_Outer_list(obj, val);
      } finally {
        __release(obj);
      }
    },
    __get_Outer_list(obj) {
      // assembly/generated/__get_Outer_list(assembly/generated/Outer) => ~lib/array/Array<f64>
      obj = __lowerRecord15(obj) || __notnull();
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
    __new_BaseClass() {
      // assembly/generated/__new_BaseClass() => assembly/generated/BaseClass
      return __liftInternref(exports.__new_BaseClass() >>> 0);
    },
    __idof_BaseClass() {
      // assembly/generated/__idof_BaseClass() => u32
      return exports.__idof_BaseClass() >>> 0;
    },
    __set_BaseClass_instanceProp(obj, val) {
      // assembly/generated/__set_BaseClass_instanceProp(assembly/generated/BaseClass, f64) => void
      obj = __lowerInternref(obj) || __notnull();
      exports.__set_BaseClass_instanceProp(obj, val);
    },
    __get_BaseClass_instanceProp(obj) {
      // assembly/generated/__get_BaseClass_instanceProp(assembly/generated/BaseClass) => f64
      obj = __lowerInternref(obj) || __notnull();
      return exports.__get_BaseClass_instanceProp(obj);
    },
    __new_ExtendedClass() {
      // assembly/generated/__new_ExtendedClass() => assembly/generated/ExtendedClass
      return __liftInternref(exports.__new_ExtendedClass() >>> 0);
    },
    __idof_ExtendedClass() {
      // assembly/generated/__idof_ExtendedClass() => u32
      return exports.__idof_ExtendedClass() >>> 0;
    },
    __set_ExtendedClass_extendedProp(obj, val) {
      // assembly/generated/__set_ExtendedClass_extendedProp(assembly/generated/ExtendedClass, f64) => void
      obj = __lowerInternref(obj) || __notnull();
      exports.__set_ExtendedClass_extendedProp(obj, val);
    },
    __get_ExtendedClass_extendedProp(obj) {
      // assembly/generated/__get_ExtendedClass_extendedProp(assembly/generated/ExtendedClass) => f64
      obj = __lowerInternref(obj) || __notnull();
      return exports.__get_ExtendedClass_extendedProp(obj);
    },
    trainModelWasm(data, labels, epochs, learningRate) {
      // assembly/generated/trainModelWasm(~lib/array/Array<~lib/array/Array<f64>>, ~lib/array/Array<~lib/array/Array<f64>>, f64, f64) => assembly/generated/Model
      data = __retain(__lowerArray((pointer, value) => { __setU32(pointer, __lowerArray(__setF64, 6, 3, value) || __notnull()); }, 7, 2, data) || __notnull());
      labels = __lowerArray((pointer, value) => { __setU32(pointer, __lowerArray(__setF64, 6, 3, value) || __notnull()); }, 7, 2, labels) || __notnull();
      try {
        return __liftInternref(exports.trainModelWasm(data, labels, epochs, learningRate) >>> 0);
      } finally {
        __release(data);
      }
    },
    predictWasm(input, model) {
      // assembly/generated/predictWasm(~lib/array/Array<f64>, assembly/generated/Model) => ~lib/array/Array<f64>
      input = __retain(__lowerArray(__setF64, 6, 3, input) || __notnull());
      model = __lowerInternref(model) || __notnull();
      try {
        return __liftArray(__getF64, 3, exports.predictWasm(input, model) >>> 0);
      } finally {
        __release(input);
      }
    },
    createComplex(id) {
      // assembly/generated/createComplex(f64) => assembly/generated/ComplexObj
      return __liftRecord10(exports.createComplex(id) >>> 0);
    },
    processComplex(obj) {
      // assembly/generated/processComplex(assembly/generated/ComplexObj) => f64
      obj = __lowerRecord10(obj) || __notnull();
      return exports.processComplex(obj);
    },
    createMixed() {
      // assembly/generated/createMixed() => assembly/generated/MixedObj
      return __liftRecord11(exports.createMixed() >>> 0);
    },
    callMixed(obj) {
      // assembly/generated/callMixed(assembly/generated/MixedObj) => f64
      obj = __lowerRecord11(obj) || __notnull();
      return exports.callMixed(obj);
    },
    multiplyMatrix(m1, m2) {
      // assembly/generated/multiplyMatrix(assembly/generated/Matrix, assembly/generated/Matrix) => assembly/generated/Matrix
      m1 = __retain(__lowerRecord12(m1) || __notnull());
      m2 = __lowerRecord12(m2) || __notnull();
      try {
        return __liftRecord12(exports.multiplyMatrix(m1, m2) >>> 0);
      } finally {
        __release(m1);
      }
    },
    greet(name) {
      // assembly/generated/greet(~lib/string/String) => ~lib/string/String
      name = __lowerString(name) || __notnull();
      return __liftString(exports.greet(name) >>> 0);
    },
    sumArray(arr) {
      // assembly/generated/sumArray(~lib/array/Array<f64>) => f64
      arr = __lowerArray(__setF64, 6, 3, arr) || __notnull();
      return exports.sumArray(arr);
    },
    doubleArray(arr) {
      // assembly/generated/doubleArray(~lib/array/Array<f64>) => ~lib/array/Array<f64>
      arr = __lowerArray(__setF64, 6, 3, arr) || __notnull();
      return __liftArray(__getF64, 3, exports.doubleArray(arr) >>> 0);
    },
    addPoints(p1, p2) {
      // assembly/generated/addPoints(assembly/generated/Point, assembly/generated/Point) => assembly/generated/Point
      p1 = __retain(__lowerRecord13(p1) || __notnull());
      p2 = __lowerRecord13(p2) || __notnull();
      try {
        return __liftRecord13(exports.addPoints(p1, p2) >>> 0);
      } finally {
        __release(p1);
      }
    },
    processOuter(o) {
      // assembly/generated/processOuter(assembly/generated/Outer) => assembly/generated/Outer
      o = __lowerRecord15(o) || __notnull();
      return __liftRecord15(exports.processOuter(o) >>> 0);
    },
    sumMatrix(mat) {
      // assembly/generated/sumMatrix(~lib/array/Array<~lib/array/Array<f64>>) => f64
      mat = __lowerArray((pointer, value) => { __setU32(pointer, __lowerArray(__setF64, 6, 3, value) || __notnull()); }, 7, 2, mat) || __notnull();
      return exports.sumMatrix(mat);
    },
    transformPoints(points) {
      // assembly/generated/transformPoints(~lib/array/Array<assembly/generated/Point>) => ~lib/array/Array<assembly/generated/Point>
      points = __lowerArray((pointer, value) => { __setU32(pointer, __lowerRecord13(value) || __notnull()); }, 20, 2, points) || __notnull();
      return __liftArray(pointer => __liftRecord13(__getU32(pointer)), 2, exports.transformPoints(points) >>> 0);
    },
    createRect(x, y, w, h) {
      // assembly/generated/createRect(f64, f64, f64, f64) => assembly/generated/Rect
      return __liftInternref(exports.createRect(x, y, w, h) >>> 0);
    },
    scaleRect(r, scale) {
      // assembly/generated/scaleRect(assembly/generated/Rect, f64) => assembly/generated/Rect
      r = __lowerInternref(r) || __notnull();
      return __liftInternref(exports.scaleRect(r, scale) >>> 0);
    },
    rectArea(r) {
      // assembly/generated/rectArea(assembly/generated/Rect) => f64
      r = __lowerInternref(r) || __notnull();
      return exports.rectArea(r);
    },
    getFunc() {
      // assembly/generated/getFunc() => assembly/generated/Closure
      return __liftInternref(exports.getFunc() >>> 0);
    },
    getAdder(amount) {
      // assembly/generated/getAdder(f64) => assembly/generated/Closure
      return __liftInternref(exports.getAdder(amount) >>> 0);
    },
    testGlobalCapture() {
      // assembly/generated/testGlobalCapture() => assembly/generated/Closure
      return __liftInternref(exports.testGlobalCapture() >>> 0);
    },
    isPrimeWasm(n) {
      // assembly/generated/isPrimeWasm(f64) => bool
      return exports.isPrimeWasm(n) != 0;
    },
    bubbleSortWasm(arr) {
      // assembly/generated/bubbleSortWasm(~lib/array/Array<f64>) => ~lib/array/Array<f64>
      arr = __lowerArray(__setF64, 6, 3, arr) || __notnull();
      return __liftArray(__getF64, 3, exports.bubbleSortWasm(arr) >>> 0);
    },
    matrixMultiplyWasm(a, b, size) {
      // assembly/generated/matrixMultiplyWasm(~lib/array/Array<f64>, ~lib/array/Array<f64>, f64) => ~lib/array/Array<f64>
      a = __retain(__lowerArray(__setF64, 6, 3, a) || __notnull());
      b = __lowerArray(__setF64, 6, 3, b) || __notnull();
      try {
        return __liftArray(__getF64, 3, exports.matrixMultiplyWasm(a, b, size) >>> 0);
      } finally {
        __release(a);
      }
    },
    findPathWasm(width, height, walls, startX, startY, endX, endY) {
      // assembly/generated/findPathWasm(f64, f64, ~lib/array/Array<f64>, f64, f64, f64, f64) => ~lib/array/Array<f64>
      walls = __lowerArray(__setF64, 6, 3, walls) || __notnull();
      return __liftArray(__getF64, 3, exports.findPathWasm(width, height, walls, startX, startY, endX, endY) >>> 0);
    },
  }, exports);
  function __liftRecord9(pointer) {
    // assembly/generated/NestedObj
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      val: __getF64(pointer + 0),
      fn: __liftInternref(__getU32(pointer + 8)),
    };
  }
  function __lowerRecord9(value) {
    // assembly/generated/NestedObj
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(12, 9));
    __setF64(pointer + 0, value.val);
    __setU32(pointer + 8, __lowerInternref(value.fn) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord10(pointer) {
    // assembly/generated/ComplexObj
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      id: __getF64(pointer + 0),
      list: __liftArray(__getF64, 3, __getU32(pointer + 8)),
      nested: __liftRecord9(__getU32(pointer + 12)),
      processor: __liftInternref(__getU32(pointer + 16)),
    };
  }
  function __lowerRecord10(value) {
    // assembly/generated/ComplexObj
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(20, 10));
    __setF64(pointer + 0, value.id);
    __setU32(pointer + 8, __lowerArray(__setF64, 6, 3, value.list) || __notnull());
    __setU32(pointer + 12, __lowerRecord9(value.nested) || __notnull());
    __setU32(pointer + 16, __lowerInternref(value.processor) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord11(pointer) {
    // assembly/generated/MixedObj
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      wasmFn: __liftInternref(__getU32(pointer + 0)),
      jsFn: __liftInternref(__getU32(pointer + 4)),
    };
  }
  function __lowerRecord11(value) {
    // assembly/generated/MixedObj
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(8, 11));
    __setU32(pointer + 0, __lowerInternref(value.wasmFn) || __notnull());
    __setU32(pointer + 4, __lowerInternref(value.jsFn) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord12(pointer) {
    // assembly/generated/Matrix
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      rows: __getF64(pointer + 0),
      cols: __getF64(pointer + 8),
      data: __liftArray(__getF64, 3, __getU32(pointer + 16)),
    };
  }
  function __lowerRecord12(value) {
    // assembly/generated/Matrix
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(20, 12));
    __setF64(pointer + 0, value.rows);
    __setF64(pointer + 8, value.cols);
    __setU32(pointer + 16, __lowerArray(__setF64, 6, 3, value.data) || __notnull());
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord13(pointer) {
    // assembly/generated/Point
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      x: __getF64(pointer + 0),
      y: __getF64(pointer + 8),
    };
  }
  function __lowerRecord13(value) {
    // assembly/generated/Point
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(16, 13));
    __setF64(pointer + 0, value.x);
    __setF64(pointer + 8, value.y);
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord14(pointer) {
    // assembly/generated/Inner
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      val: __getF64(pointer + 0),
    };
  }
  function __lowerRecord14(value) {
    // assembly/generated/Inner
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(8, 14));
    __setF64(pointer + 0, value.val);
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord15(pointer) {
    // assembly/generated/Outer
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      name: __liftString(__getU32(pointer + 0)),
      inner: __liftRecord14(__getU32(pointer + 4)),
      list: __liftArray(__getF64, 3, __getU32(pointer + 8)),
    };
  }
  function __lowerRecord15(value) {
    // assembly/generated/Outer
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(12, 15));
    __setU32(pointer + 0, __lowerString(value.name) || __notnull());
    __setU32(pointer + 4, __lowerRecord14(value.inner) || __notnull());
    __setU32(pointer + 8, __lowerArray(__setF64, 6, 3, value.list) || __notnull());
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
  seedTrain,
  seed,
  __js_callback_createComplex_0_index,
  __js_callback_createComplex_1_index,
  __js_callback_createMixed_0_index,
  __js_callback_createMixed_1_index,
  g_amount,
  globalX,
  seedBenchmark,
  __new_Model,
  __idof_Model,
  __set_Model_weights,
  __get_Model_weights,
  __set_Model_biases,
  __get_Model_biases,
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
  __new_BaseClass,
  __idof_BaseClass,
  __set_BaseClass_instanceProp,
  __get_BaseClass_instanceProp,
  __new_ExtendedClass,
  __idof_ExtendedClass,
  __set_ExtendedClass_extendedProp,
  __get_ExtendedClass_extendedProp,
  __lambda_getFunc_0,
  __lambda_getAdder_1,
  __lambda_testGlobalCapture_2,
  random1,
  max1,
  trainModelWasm,
  predictWasm,
  createComplex,
  processComplex,
  createMixed,
  callMixed,
  multiplyMatrix,
  inline_add,
  inline_calculate,
  add,
  factorial,
  greet,
  addInt,
  sumArray,
  doubleArray,
  addPoints,
  processOuter,
  sumMatrix,
  transformPoints,
  createRect,
  scaleRect,
  rectArea,
  getStaticProp,
  testClassFeatures,
  testCallback,
  getFunc,
  getAdder,
  testGlobalCapture,
  addGlobal,
  isPrimeWasm,
  countPrimesWasm,
  fibInner,
  fibonacciWasm,
  bubbleSortWasm,
  matrixMultiplyWasm,
  monteCarloPiWasm,
  findPathWasm,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("jsw.wasm", import.meta.url));
