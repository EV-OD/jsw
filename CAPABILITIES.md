# JSW Capabilities & Limitations

This document outlines the current features and limitations of the JSW (JavaScript -> AssemblyScript -> WebAssembly) selective compilation pipeline.

## Capabilities (What it can do)

### 1. Selective Compilation
- **"use wasm" Directive**: You can opt-in to compilation by adding `"use wasm";` at the start of any top-level function.
- **Automatic Extraction**: The system automatically finds, extracts, and compiles these functions.
- **Seamless Integration**: The original JS function is replaced with a wrapper that handles calling the Wasm binary.

### 2. Type Support (TypeScript)
The system uses TypeScript type annotations to infer AssemblyScript types:
- **Numbers**: `number` is mapped to `f64` (double-precision float).
- **Integers**: `number` is mapped to `f64` by default. (Explicit `i32` support requires specific casting or type aliases, currently defaults to `f64`).
- **Strings**: `string` is fully supported. The system automatically handles:
    - Allocating memory in Wasm for input strings.
    - Reading returned strings from Wasm memory.
- **Booleans**: `boolean` is mapped to `bool`.
- **Void**: `void` return types are supported.

### 3. Standard Output
- **console.log**: You can use `console.log()` inside your compiled functions. It is proxied to the browser's `console.log`.

### 4. Control Flow & Logic
- **Recursion**: Recursive function calls are supported (e.g., `factorial`).
- **Arithmetic**: Standard mathematical operations (`+`, `-`, `*`, `/`, etc.) work as expected.
- **Conditionals/Loops**: `if`, `else`, `for`, `while` loops are supported (as long as they compile to valid AssemblyScript).

### 5. Developer Experience
- **Hot Module Replacement (HMR)**: Changing a source file triggers a fast re-compile of the Wasm binary and reloads the page.
- **No Manual Glue Code**: All memory management for strings and function calls is generated automatically.

---

## Limitations (What it cannot do yet)

### 1. Higher-Order Functions
- **Passing Functions**: You cannot pass a JavaScript function as an argument to a compiled function (Callbacks).
- **Returning Functions**: You cannot return a function from a compiled function (Closures).

### 2. Closures & Scope
- **Environment Capture**: Compiled functions cannot "capture" variables from their surrounding JavaScript scope. They must be pure or only rely on their arguments and global Wasm state.
    ```typescript
    let x = 10;
    function addX(y: number) {
        "use wasm";
        return y + x; // Error: 'x' is not defined in Wasm scope
    }
    ```

### 3. Complex Data Structures
- **Objects & Arrays**: Passing JavaScript Objects (`{}`) or Arrays (`[]`) is not supported. Only primitive types (`number`, `string`, `boolean`) are marshalled.
- **Classes**: JS Classes are not mapped to AS Classes.

### 4. JavaScript Standard Library
- **Built-ins**: You cannot use JS built-ins like `Math` (unless using AS native `Math`), `Date`, `RegExp`, `JSON`, `Promise`, etc., unless you manually implement bindings.
- **DOM API**: No access to the DOM (document, window, etc.) directly from Wasm.

### 5. Dynamic Typing
- **`any` type**: AssemblyScript is strictly typed. You cannot use `any` or rely on dynamic type coercion (e.g., `1 + "2"`).

### 6. Async/Await
- **Async Functions**: You cannot mark an `async` function with `"use wasm"`. Wasm execution is synchronous (unless using specific tools like Asyncify, which is not integrated).

### 7. Error Handling
- **Exceptions**: JavaScript `try/catch` blocks inside Wasm do not work for catching JS errors. Wasm traps (aborts) will stop execution but don't map 1:1 to JS exceptions.
