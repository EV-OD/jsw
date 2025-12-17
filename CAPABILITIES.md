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
- **Integers**: You can use `type i32 = number;` to use 32-bit integers in AssemblyScript.
- **Strings**: `string` is fully supported. The system automatically handles:
    - Allocating memory in Wasm for input strings.
    - Reading returned strings from Wasm memory.
- **Booleans**: `boolean` is mapped to `bool`.
- **Void**: `void` return types are supported.

### 3. Complex Data Structures
- **Objects (Interfaces)**: TypeScript Interfaces are compiled to AssemblyScript Classes.
    - Automatic marshalling of objects between JS and Wasm.
    - Support for nested objects.
- **Arrays**: Full support for Arrays (`[]`).
    - Arrays of primitives (`number[]`, `string[]`).
    - Arrays of objects (`Point[]`).
    - Nested arrays (`number[][]`).

### 4. Standard Output
- **console.log**: You can use `console.log()` inside your compiled functions. It is automatically transformed to call the Wasm import.

### 5. Control Flow & Logic
- **Recursion**: Recursive function calls are supported (e.g., `factorial`).
- **Arithmetic**: Standard mathematical operations (`+`, `-`, `*`, `/`, etc.) work as expected.
- **Conditionals/Loops**: `if`, `else`, `for`, `while` loops are supported (as long as they compile to valid AssemblyScript).

### 6. Developer Experience
- **Hot Module Replacement (HMR)**: Changing a source file triggers a fast re-compile of the Wasm binary and reloads the page.
- **No Manual Glue Code**: All memory management for strings, arrays, objects, and function calls is generated automatically.

### 7. Higher-Order Functions
- **Callbacks**: You can pass JavaScript functions as arguments to compiled functions.
    - The system automatically registers the callback and handles the invocation from Wasm.
- **Returning Functions**: You can return functions from compiled functions.
    - The returned function is wrapped so it can be called from JavaScript.

---

## Limitations (What it cannot do yet)

### 1. Closures & Scope
- **Environment Capture**: Compiled functions cannot "capture" variables from their surrounding JavaScript scope. They must be pure or only rely on their arguments and global Wasm state.
    ```typescript
    let x = 10;
    function addX(y: number) {
        "use wasm";
        return y + x; // Error: 'x' is not defined in Wasm scope
    }
    ```

### 2. Classes
- **JS Classes**: JavaScript/TypeScript `class` definitions are not yet supported. Use `interface` for data structures.

### 4. JavaScript Standard Library
- **Built-ins**: You cannot use JS built-ins like `Math` (unless using AS native `Math`), `Date`, `RegExp`, `JSON`, `Promise`, etc., unless you manually implement bindings.
- **DOM API**: No access to the DOM (document, window, etc.) directly from Wasm.

### 5. Dynamic Typing
- **`any` type**: AssemblyScript is strictly typed. You cannot use `any` or rely on dynamic type coercion (e.g., `1 + "2"`).

### 6. Async/Await
- **Async Functions**: You cannot mark an `async` function with `"use wasm"`. Wasm execution is synchronous (unless using specific tools like Asyncify, which is not integrated).

### 7. Error Handling
- **Exceptions**: JavaScript `try/catch` blocks inside Wasm do not work for catching JS errors. Wasm traps (aborts) will stop execution but don't map 1:1 to JS exceptions.
