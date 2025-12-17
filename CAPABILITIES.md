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
- **Classes**: TypeScript Classes are compiled to AssemblyScript Classes.
    - Support for fields and constructors.
    - `new Class(...)` syntax is supported inside Wasm functions.
    - Methods are currently ignored (data-only classes).
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

### 8. Closures & Scope
- **Environment Capture**: Compiled functions can capture variables from their surrounding scope (Closures).
- **Global Variables**: Module-level variables are supported and can be accessed/modified by compiled functions.

### 9. Advanced Object Support
- **Methods in Objects**: Objects returned from Wasm can contain methods (Closures).
- **Round-Trip Functions**: Functions passed into Wasm (in objects) can be passed back to JS seamlessly.
- **Nested Structures**: Deeply nested objects and arrays are fully supported.
    - Supported for local variables and arguments.
    - Supported for module-level global variables.
    ```typescript
    let x = 10;
    function addX(y: number) {
        "use wasm";
        return y + x; // Works!
    }
    ```

### 10. Classes (Data Structures)
- **Data Classes**: JavaScript/TypeScript `class` definitions are supported as data structures.
    - Fields are extracted and compiled to AssemblyScript classes.
    - Instances can be passed to and returned from Wasm.
    - **Note**: Methods and Constructors defined in JS classes are **NOT** compiled to Wasm. The class is treated as a struct (DTO).

---

## Limitations (What it cannot do yet)

### 1. Class Methods
- **Methods**: Methods defined inside a JS `class` are not compiled to Wasm. Only the data fields are used.

### 4. JavaScript Standard Library
- **Built-ins**: You cannot use JS built-ins like `Math` (unless using AS native `Math`), `Date`, `RegExp`, `JSON`, `Promise`, etc., unless you manually implement bindings.
- **DOM API**: No access to the DOM (document, window, etc.) directly from Wasm.

### 5. Dynamic Typing
- **`any` type**: AssemblyScript is strictly typed. You cannot use `any` or rely on dynamic type coercion (e.g., `1 + "2"`).

### 6. Async/Await
- **Async Functions**: You cannot mark an `async` function with `"use wasm"`. Wasm execution is synchronous (unless using specific tools like Asyncify, which is not integrated).

### 7. Error Handling
- **Exceptions**: JavaScript `try/catch` blocks inside Wasm do not work for catching JS errors. Wasm traps (aborts) will stop execution but don't map 1:1 to JS exceptions.
