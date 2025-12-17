Concepts
An overview of basic AssemblyScript concepts.

#TypeScript-like
AssemblyScript is very similar to TypeScript with largely compatible syntax and semantics. As such, many of the concepts known from TypeScript apply to AssemblyScript as well, but not all TypeScript features map well to ahead of time compilation or WebAssembly's so far supported feature set. Some features have been omitted, others not yet implemented, and a few additional concepts needed to be added, technically making AssemblyScript part a subset, part a superset - a variant. As such it is unlikely that existing TypeScript code can be compiled by the AssemblyScript compiler, but likely that sufficiently strict code can be ported with little effort.

A detailed overview of supported TypeScript features is available within Implementation status.

#Strictly typed
While TypeScript has types, its type system is able to describe many of JavaScript's dynamic features. TypeScript is a superset / a type checker on top of JavaScript after all. On the contrary, AssemblyScript is compiled statically ahead of time, making it infeasible to support very dynamic JavaScript features to not enter interpreter territory, respectively requires stricter type checking to guarantee correctness at runtime where TypeScript would not complain.

As a result, there is no any or undefined:

// 😢
function foo(a?) {
  var b = a + 1
  return b
}

// 😊
function foo(a: i32 = 0): i32 {
  var b = a + 1
  return b
}
There are no union types yet, but a similar effect can be achieved with generics:

// 😢
function foo(a: i32 | string): void {
}

// 😊
function foo<T>(a: T): void {
}
Objects must be typed, say using a Map or class:

// 😢
var a = {}
a.prop = "hello world"

// 😊
var a = new Map<string,string>()
a.set("prop", "hello world")

// 😊
class A {
  constructor(public prop: string) {}
}
var a = new A("hello world")
And nullability checks are limited to locals to guarantee soundness where TypeScript would not (opens new window)diagnose (opens new window)a problem (opens new window):

function doSomething(foo: Foo): void {
  // 😢
  if (foo.something) {
    foo.something.length // fails
  }
}

function doSomething(foo: Foo): void {
  // 😊
  var something = foo.something
  if (something) {
    something.length // works
  }
}
#Sandboxed execution
One of WebAssembly's unique features is that a module cannot access external resources without explicitly importing them, providing strong security guarantees by default. As such, to do anything useful with WebAssembly, it is necessary to wire a module to the host environment, like for example JavaScript and the DOM.

#Module imports
In AssemblyScript, host functionality can be imported by utilizing the ambient context, that is using a declare statement:

// assembly/env.ts
export declare function logInteger(i: i32): void
// assembly/index.ts
import { logInteger } from "./env"

logInteger(42)
Ambient declarations in an AssemblyScript file will yield a WebAssembly module import, using the internal path of the file, without file extension, as the module name (here: assembly/env), and the name of the declared element as the module element (here logInteger). In the example above, the import can be fulfilled by providing the following imports object upon instantiation:

WebAssembly.instantiateStreaming(fetch(...), {
  "assembly/env": {
    logInteger(i) { console.log("logInteger: " + i) }
  }
})
If necessary, the respective external module and element names can also be overridden using the @external decorator and modifying the imports object accordingly:

// assembly/index.ts
@external("log", "integer")
declare function logInteger(i: i32): void // { "log": { "integer"(i) { ... } } }

logInteger(42)
#Module exports
Similarly, exports from an entry file will yield WebAssembly module exports:

// assembly/index.ts
export function add(a: i32, b: i32): i32 {
  return a + b
}
Module exports can then be called from the host environment:

const { instance: { exports } } = await WebAssembly.instantiateStreaming(...)

console.log(exports.add(1, 2))
See also: Host bindings automate much of the wiring.

#Special imports
Some language features need support from the host environment to function, yielding a few special module imports depending on the feature set used within the module. Generated bindings provide these automatically where necessary.

function env.abort?(message: usize, fileName: usize, line: u32, column: u32): void
Called on unrecoverable errors. Typically present if assertions are enabled or errors are thrown.

function env.trace?(message: usize, n: i32, a0..4?: f64): void
Called when trace is called in user code. Only present if it is.

function env.seed?(): f64
Called when the random number generator needs to be seeded. Only present if it is.

The respective implementations of abort, trace and seed can be overridden with, for example, --use abort=assembly/index/myAbort, here redirecting calls to abort to a custom myAbort function in assembly/index.ts. Useful if an environment does not provide compatible implementations, or when the respective imports are not desired and custom implementations are sufficient.

#Accessing memory during instantiation
One important edge case to be aware of is that top-level statements are executed as part of the WebAssembly module's implicit (start ...) function by default, which leads to a chicken and egg problem when top-level statements already call out to external functionality that needs to access the module's memory instance (say, reading the contents of a logged string). Since instantiation did not yet complete, the module's exports, including exported memory, are not available yet and the access will fail.

A solution is to utilize the --exportStart command line option to force exporting the start function instead of making it implicit. Then, instantiation first returns before any code is executed. Note, however, that the exported start function must always be called first, before any other exports, or undefined behavior will occur.

#Tree-shaking
AssemblyScript does not compile a module linearly, but starts at the module's exports and only compiles what's reachable from them, often referred to as tree-shaking (opens new window). As such, dead code is always validated syntactically, but not necessarily checked for semantic correctness. While this mechanism significantly helps to reduce compile times and feels almost natural to those familiar with executing JavaScript, it may initially feel a little strange not only to those with a background in traditional compilers, for example because emitted diagnostics do not happen linearly, but also to those with a background in TypeScript, because even type annotations remain unchecked as part of dead code. The exception to the rule is top-level code, including top-level variable declarations and their initializers, that must be evaluated as soon as the respective file would first execute.

#Branch-level tree-shaking
In addition to module-level tree-shaking, the compiler ignores branches that it can prove won't be taken. Works with constants, built-ins that compile to a constant, expressions that can be precomputed to a constant, plus the following globals to detect specific compiler flags or features:

const ASC_TARGET: i32
Indicates the compilation target. Possible values are 0 = JS (portable), 1 = WASM32, 2 = WASM64.

const ASC_NO_ASSERT: bool
Whether --noAssert has been set.

const ASC_MEMORY_BASE: usize
The value of --memoryBase.

const ASC_OPTIMIZE_LEVEL: i32
The value of --optimizeLevel. Possible values are 0, 1, 2 and 3.

const ASC_SHRINK_LEVEL: i32
The value of --shrinkLevel. Possible values are 0, 1 and 2.

const ASC_LOW_MEMORY_LIMIT: i32
The value of --lowMemoryLimit.

const ASC_EXPORT_RUNTIME: i32
Whether --exportRuntime has been set.

const ASC_FEATURE_SIGN_EXTENSION: bool
const ASC_FEATURE_MUTABLE_GLOBALS: bool
const ASC_FEATURE_NONTRAPPING_F2I: bool
const ASC_FEATURE_BULK_MEMORY: bool
const ASC_FEATURE_SIMD: bool
const ASC_FEATURE_THREADS: bool
const ASC_FEATURE_EXCEPTION_HANDLING: bool
const ASC_FEATURE_TAIL_CALLS: bool
const ASC_FEATURE_REFERENCE_TYPES: bool
const ASC_FEATURE_MULTI_VALUE: bool
const ASC_FEATURE_GC: bool
const ASC_FEATURE_MEMORY64: bool
Whether the respective feature is enabled.

For example, if a library supports SIMD but also wants to provide a fallback when being compiled without SIMD support:

if (ASC_FEATURE_SIMD) {
  // compute with SIMD operations
} else {
  // fallback without SIMD operations
}
#Code annotations
Decorators work more like compiler annotations in AssemblyScript and are evaluated at compile time.

Annotation	Description
@inline	Requests inlining of a constant or function.
@final	Annotates a class as final, that is it cannot be subclassed.
@unmanaged	Annotates a class as not tracked by GC, effectively becoming a C-like struct.
@external	Changes the external name of an imported element. @external(module, name) changes both the module and element name, @external(name) changes the element name only.
Custom decorators are ignored, unless given meaning by using a transform.

There are a few more built-in decorators that are likely going to change significantly over time, or may even be removed entirely. While useful for standard library implementation currently, it is not recommend to utilize them in custom code since tooling does not recognize them.