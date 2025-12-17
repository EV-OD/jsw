Globals
The following global constants and functions are present alongside the standard library's classes.

#Constants
const NaN: auto // f32 or f64
Not a number as a 32-bit or 64-bit float depending on context. Compiles to a constant.

const Infinity: auto // f32 or f64
Positive infinity as a 32-bit or 64-bit float depending on context. Compiles to a constant.

#Functions
function isNaN<T>(value: T): bool
Tests if a 32-bit or 64-bit float is NaN.

function isFinite<T>(value: T): bool
Tests if a 32-bit or 64-bit float is finite, that is not NaN or +/-Infinity.

function parseInt(str: string, radix?: i32): f64
Parses a string representing an integer to an f64 number Returns NaN on invalid inputs.

Type-specific variants of parseInt are available separately:

F32.parseInt to parse to a 32-bit float.
I8.parseInt to parse to a signed 8-bit integer, respectively U8.parseInt if unsigned.
I16.parseInt to parse to a signed 16-bit integer, respectively U16.parseInt if unsigned.
I32.parseInt to parse to a signed 32-bit integer, respectively U32.parseInt if unsigned.
I64.parseInt to parse to a signed 64-bit integer, respectively U64.parseInt if unsigned.
function parseFloat(str: string): f64
Parses a string to a 64-bit float. Returns NaN on invalid inputs.

#Builtins
The following builtins provide direct access to WebAssembly and compiler features. They form the low-level foundation of the standard library, while also being available for everyone to utilize where directly tapping into WebAssembly or the compiler is desired.

#Static type checks
By making use of the following special type checks, especially in generic contexts, untaken branches can be eliminated statically, leading to concrete WebAssembly functions that handle one type specificially.

function isInteger<T>(value?: T): bool
Tests if the specified type or expression is of an integer type and not a reference. Compiles to a constant.

function isSigned<T>(value?: T): bool
Tests if the specified type or expression can represent negative numbers. Compiles to a constant.

function isFloat<T>(value?: T): bool
Tests if the specified type or expression is of a float type. Compiles to a constant.

function isVector<T>(value?: T): bool
Tests if the specified type or expression is of a SIMD vector type. Compiles to a constant.

function isReference<T>(value?: T): bool
Tests if the specified type or expression is of a reference type. Compiles to a constant.

function isString<T>(value?: T): bool
Tests if the specified type or expression can be used as a string. Compiles to a constant.

function isArray<T>(value?: T): bool
Tests if the specified type or expression can be used as an array. Compiles to a constant.

function isFunction<T>(value?: T): bool
Tests if the specified type or expression is of a function type. Compiles to a constant.

function isNullable<T>(value?: T): bool
Tests if the specified type or expression is of a nullable reference type. Compiles to a constant.

function isDefined(expression: auto): bool
Tests if the specified expression resolves to a defined element. Compiles to a constant.

function isConstant(expression: auto): bool
Tests if the specified expression evaluates to a constant value. Compiles to a constant.

function isManaged<T>(expression: auto): bool
Tests if the specified type or expression is of a managed type. Compiles to a constant. Usually only relevant when implementing custom collection-like classes.

#Example of static type checking
function add<T>(a: T, b: T): T {
  return a + b // addition if numeric, string concatenation if a string
}

function add<T>(a: T, b: T): T {
  if (isString<T>()) { // eliminated if T is not a string
    return parseInt(a) + parseInt(b)
  } else { // eliminated if T is a string
    return a + b
  }
}
TIP

If you are not going to use low-level WebAssembly in the foreseeable future, feel free to come back to the following paragraphs at a later time.

#Utilities
function bswap<T>(value: T): T
Reverses the byte order of the specified integer.

function sizeof<T>(): usize
Determines the byte size of the respective basic type. Means: If T is a class type, the size of usize, the pointer type, is returned. To obtain the size of a class in memory, use offsetof<T>() instead. Compiles to a constant.

function offsetof<T>(fieldName?: string): usize
Determines the offset of the specified field within the given class type. If fieldName is omitted, this returns what could be interpreted as either the size of the class, or the offset where the next field would be located, before alignment. Compiles to a constant. The fieldName argument must be a compile-time constant string because there is no information about field names anymore at runtime. Therefore, the field's name must be known at the time the returned constant is computed.

function alignof<T>(): usize
Determines the alignment (log2) of the specified underlying basic type; i.e. If T is a class type, the alignment of usize is returned. Compiles to a constant.

function assert<T>(isTrueish: T, message?: string): T
Traps if the specified value is not true-ish, otherwise returns the non-nullable value. Like assertions in C, aborting the entire program if the expectation fails. Where desired, the --noAssert compiler option can be used to disable assertions in production.

function trace(message: string, n?: i32, a0?: f64, a1?: f64, a2?: f64, a3?: f64, a4?: f64): void
Simple trace function which prints message and 5 optional f64 arguments to a console. n is count of used arguments.

#Usage examples
trace("foo");
trace("one arg:", 1, 5.0);
trace("three args:", 3, 1.0, <f64>2, 3);
function instantiate<T>(...args: auto[]): T
Instantiates a new instance of T using the specified constructor arguments.

function changetype<T>(value: auto): T
Changes the type of a value to another one. Useful for casting class instances to their pointer values and vice-versa.

function idof<T>(): u32
Obtains the computed unique id of a class type. Usually only relevant when allocating objects or dealing with RTTI externally.

function nameof<T>(value?: T): string
Returns the name of a given type.

#WebAssembly
#Math
The following generic built-ins compile to WebAssembly instructions directly.

function clz<T>(value: T): T
Performs the sign-agnostic count leading zero bits operation on a 32-bit or 64-bit integer. All zero bits are considered leading if the value is zero.
function ctz<T>(value: T): T
Performs the sign-agnostic count trailing zero bits operation on a 32-bit or 64-bit integer. All zero bits are considered trailing if the value is zero.
function popcnt<T>(value: T): T
Performs the sign-agnostic count number of one bits operation on a 32-bit or 64-bit integer.
function rotl<T>(value: T, shift: T): T
Performs the sign-agnostic rotate left operation on a 32-bit or 64-bit integer.
function rotr<T>(value: T, shift: T): T
Performs the sign-agnostic rotate right operation on a 32-bit or 64-bit integer.
function abs<T>(value: T): T
Computes the absolute value of an integer or float.
function max<T>(left: T, right: T): T
Determines the maximum of two integers or floats. If either operand is NaN, returns NaN.
function min<T>(left: T, right: T): T
Determines the minimum of two integers or floats. If either operand is NaN, returns NaN.
function ceil<T>(value: T): T
Performs the ceiling operation on a 32-bit or 64-bit float.
function floor<T>(value: T): T
Performs the floor operation on a 32-bit or 64-bit float.
function copysign<T>(x: T , y: T): T
Composes a 32-bit or 64-bit float from the magnitude of x and the sign of y.
function nearest<T>(value: T): T
Rounds to the nearest integer half to even of a 32-bit or 64-bit float.
function reinterpret<TTo>(value: auto): TTo
Reinterprets the bits of the specified value as type T.
function sqrt<T>(value: T): T
Calculates the square root of a 32-bit or 64-bit float.
function trunc<T>(value: T): T
Rounds to the nearest integer towards zero of a 32-bit or 64-bit float.
#Memory
Similarly, the following built-ins emit WebAssembly instructions accessing or otherwise modifying memory.

NOTE

The immOffset and immAlign arguments, if provided, must be compile time constant values. See more details in rationale (opens new window).

function load<T>(ptr: usize, immOffset?: usize, immAlign?: usize): T
Loads a value of the specified type from memory. Equivalent to dereferencing a pointer in other languages.
function store<T>(ptr: usize, value: auto, immOffset?: usize, immAlign?: usize): void
Stores a value of the specified type to memory. Equivalent to dereferencing a pointer in other languages and assigning a value.
function memory.size(): i32
Returns the current size of the memory in units of pages. One page is 64kb.

function memory.grow(value: i32): i32
Grows linear memory by a given unsigned delta of pages. One page is 64kb. Returns the previous size of the memory in units of pages or -1 on failure.

WARNING

Calling memory.grow where a memory manager is present might break it.

function memory.copy(dst: usize, src: usize, n: usize): void
Copies n bytes from src to dst . Regions may overlap. Emits the respective instruction if bulk-memory is enabled, otherwise ships a polyfill.

function memory.fill(dst: usize, value: u8, n: usize): void
Fills n bytes at dst with the given byte value. Emits the respective instruction if bulk-memory is enabled, otherwise ships a polyfill.

function memory.repeat(dst: usize, src: usize, srcLength: usize, count: usize): void
Repeats a sequence of bytes given as src with srcLength count times into destination dst.

function memory.compare(lhs: usize, rhs: usize, n: usize): i32
Compares the first n bytes of left and right and returns a value that indicates their relationship:

Negative value if the first differing byte in lhs is less than the corresponding byte in rhs.
Positive value if the first differing byte in lhs is greater than the corresponding byte in rhs.
Zero​ if all n bytes of lhs and rhs are equal.
function memory.data(size: i32, align?: i32): usize
Gets a pointer to a zeroed static chunk of memory of the given size. Alignment defaults to 16. Arguments must be compile-time constants.

function memory.data<T>(values: T[], align?: i32): usize
Gets a pointer to a pre-initialized static chunk of memory. Alignment defaults to the size of T. Arguments must be compile-time constants.

#Control flow
function select<T>(ifTrue: T, ifFalse: T, condition: bool): T
Selects one of two pre-evaluated values depending on the condition. Differs from an if/else in that both arms are always executed and the final value is picked based on the condition afterwards. Performs better than an if/else only if the condition is random (means: branch prediction is not going to perform well) and both alternatives are cheap. It is also worth to note that Binaryen will do relevant optimizations like switching to a select automatically, so simply using a ternary ? : may be preferable.

function unreachable(): auto
Emits an unreachable instruction that results in a runtime error (trap) when executed. Both a statement and an expression of any type. Beware that trapping in managed code will most likely lead to memory leaks or even break the program because it ends execution prematurely.

#Atomics 🦄
The following instructions represent the WebAssembly threads and atomics (opens new window)specification. Must be enabled with --enable threads.

function atomic.load<T>(ptr: usize, immOffset?: usize): T
Atomically loads an integer value from memory and returns it.

function atomic.store<T>(ptr: usize, value: auto, immOffset?: usize): void
Atomically stores an integer value to memory.

function atomic.add<T>(ptr: usize, value: T, immOffset?: usize): T
Atomically adds an integer value in memory.

function atomic.sub<T>(ptr: usize, value: T, immOffset?: usize): T
Atomically subtracts an integer value in memory.

function atomic.and<T>(ptr: usize, value: T, immOffset?: usize): T
Atomically performs a bitwise AND operation on an integer value in memory.

function atomic.or<T>(ptr: usize, value: T, immOffset?: usize): T
Atomically performs a bitwise OR operation on an integer value in memory.

function atomic.xor<T>(ptr: usize, value: T, immOffset?: usize): T
Atomically performs a bitwise XOR operation on an integer value in memory.

function atomic.xchg<T>(ptr: usize, value: T, immOffset?: usize): T
Atomically exchanges an integer value in memory.

function atomic.cmpxchg<T>(ptr: usize, expected: T, replacement: T, immOffset?: usize): T
Atomically compares and exchanges an integer value in memory if the condition is met.

function atomic.wait<T>(ptr: usize, expected: T, timeout: i64): AtomicWaitResult
Performs a wait operation on an address in memory, suspending this agent if the integer condition is met. Return values are

Value	Description
0	OK - Woken by another agent.
1	NOT_EQUAL - Loaded value did not match the expected value.
2	TIMED_OUT - Not woken before the timeout expired.
function atomic.notify(ptr: usize, count: i32): i32
Performs a notify operation on an address in memory waking up suspended agents.

function atomic.fence(): void
Performs a fence operation, preserving synchronization guarantees of higher level languages.

#SIMD 🦄
Likewise, these represent the WebAssembly SIMD (opens new window)specification. Must be enabled with --enable simd.

function v128(a: i8, ... , p: i8): v128
Initializes a 128-bit vector from sixteen 8-bit integer values. Arguments must be compile-time constants.

See Constructing constant vectors for additional type-specific options.

function v128.splat<T>(x: T): v128
Creates a vector with identical lanes.
function v128.extract_lane<T>(x: v128, idx: u8): T
Extracts one lane as a scalar.
function v128.replace_lane<T>(x: v128, idx: u8, value: T): v128
Replaces one lane.
function v128.shuffle<T>(a: v128, b: v128, ...lanes: u8[]): v128
Selects lanes from either vector according to the specified lane indexes.
function v128.swizzle(a: v128, s: v128): v128
Selects 8-bit lanes from the first vector according to the indexes [0-15] specified by the 8-bit lanes of the second vector.

function v128.load(ptr: usize, immOffset?: usize, immAlign?: usize): v128
Loads a vector from memory.

function v128.load_ext<TFrom>(ptr: usize, immOffset?: usize, immAlign?: usize): v128
Creates a vector by loading the lanes of the specified integer type and extending each to the next larger type.
function v128.load_zero<TFrom>(ptr: usize, immOffset?: usize, immAlign?: usize): v128
Creates a vector by loading a value of the specified type into the lowest bits and initializing all other bits of the vector to zero.
function v128.load_lane<T>(
  ptr: usize, vec: v128, idx: u8, immOffset?: usize, immAlign?: usize
): v128
Loads a single lane from memory into the specified lane of the given vector. Other lanes are bypassed as is.
function v128.store_lane<T>(
  ptr: usize, vec: v128, idx: u8, immOffset?: usize, immAlign?: usize
): v128
Stores the single lane at the specified index of the given vector to memory.
function v128.load_splat<T>(ptr: usize, immOffset?: usize, immAlign?: usize): v128
Creates a vector with identical lanes by loading the splatted value.
function v128.store(ptr: usize, value: v128, immOffset?: usize, immAlign?: usize): void
Stores a vector to memory.

function v128.add<T>(a: v128, b: v128): v128
Adds each lane.
function v128.sub<T>(a: v128, b: v128): v128
Subtracts each lane.
function v128.mul<T>(a: v128, b: v128): v128
Multiplies each lane.
function v128.div<T>(a: v128, b: v128): v128
Divides each floating point lane.
function v128.neg<T>(a: v128): v128
Negates each lane.
function v128.add_sat<T>(a: v128, b: v128): v128
Adds each signed small integer lane using saturation.
function v128.sub_sat<T>(a: v128, b: v128): v128
Subtracts each signed small integer lane using saturation.
function v128.shl<T>(a: v128, b: i32): v128
Performs a bitwise left shift by a scalar on each integer lane.
function v128.shr<T>(a: v128, b: i32): v128
Performs a bitwise right shift by a scalar on each integer lane.
function v128.and(a: v128, b: v128): v128
Performs the bitwise a & b operation on each lane.

function v128.or(a: v128, b: v128): v128
Performs the bitwise a | b operation on each lane.

function v128.xor(a: v128, b: v128): v128
Performs the bitwise a ^ b operation on each lane.

function v128.andnot(a: v128, b: v128): v128
Performs the bitwise a & !b operation on each lane.

function v128.not(a: v128): v128
Performs the bitwise !a operation on each lane.

function v128.bitselect(v1: v128, v2: v128, mask: v128): v128
Selects bits of either vector according to the specified mask. Selects from v1 if the bit in mask is 1, otherwise from v2.

function v128.any_true(a: v128): bool
Reduces a vector to a scalar indicating whether any lane is considered true.

function v128.all_true<T>(a: v128): bool
Reduces a vector to a scalar indicating whether all lanes are considered true.
function v128.bitmask<T>(a: v128): bool
Extracts the high bit of each integer lane (except 64-bit) and produces a scalar mask with all bits concatenated.
function v128.popcnt<T>(a: v128): v128
Counts the number of bits set to one within each lane.
function v128.min<T>(a: v128, b: v128): v128
Computes the minimum of each lane.
function v128.max<T>(a: v128, b: v128): v128
Computes the maximum of each lane.
function v128.pmin<T>(a: v128, b: v128): v128
Computes the psuedo-minimum of each lane.
function v128.pmax<T>(a: v128, b: v128): v128
Computes the pseudo-maximum of each lane.
function v128.dot<T>(a: v128, b: v128): v128
Computes the dot product of two 16-bit integer lanes each, yielding lanes one size wider than the input.
function v128.avgr<T>(a: v128, b: v128): v128)
Computes the rounding average of each unsigned small integer lane.
function v128.abs<T>(a: v128): v128
Computes the absolute value of each lane (except 64-bit integers).
function v128.sqrt<T>(a: v128): v128
Computes the square root of each floating point lane.
function v128.ceil<T>(a: v128): v128
Performs the ceiling operation on each lane.
function v128.floor<T>(a: v128): v128
Performs the floor operation on each lane.
function v128.trunc<T>(a: v128): v128
Rounds to the nearest integer towards zero of each lane.
function v128.nearest<T>(a: v128): v128
Rounds to the nearest integer half to even of each lane.
function v128.eq<T>(a: v128, b: v128): v128
Computes which lanes are equal.
function v128.ne<T>(a: v128, b: v128): v128
Computes which lanes are not equal.
function v128.lt<T>(a: v128, b: v128): v128
Computes which lanes of the first vector are less than those of the second.
function v128.le<T>(a: v128, b: v128): v128
Computes which lanes of the first vector are less than or equal those of the second.
function v128.gt<T>(a: v128, b: v128): v128
Computes which lanes of the first vector are greater than those of the second.
function v128.ge<T>(a: v128, b: v128): v128
Computes which lanes of the first vector are greater than or equal those of the second.
function v128.convert<TFrom>(a: v128): v128
Converts each lane of a vector from integer to single-precision floating point.
function v128.convert_low<TFrom>(a: v128): v128
Converts the low lanes of a vector from integer to double-precision floating point.
function v128.trunc_sat<TTo>(a: v128): v128
Truncates each lane of a vector from single-precision floating point to integer with saturation. Takes the target type.
function v128.trunc_sat_zero<TTo>(a: v128): v128
Truncates each lane of a vector from double-precision floating point to integer with saturation. Takes the target type.
function v128.narrow<TFrom>(a: v128, b: v128): v128
Narrows wider integer lanes to their respective narrower lanes.
function v128.extend_low<TFrom>(a: v128): v128
Extends the low half of narrower integer lanes to their respective wider lanes.
function v128.extend_high<TFrom>(a: v128): v128
Extends the high half of narrower integer lanes to their respective wider lanes.
function v128.extadd_pairwise<TFrom>(a: v128): v128
Adds lanes pairwise producing twice wider extended results.
function v128.demote_zero<T>(a: v128): v128
Demotes each float lane to lower precision. The higher lanes of the result are initialized to zero.
function v128.promote_low<T>(a: v128): v128
Promotes the lower float lanes to higher precision.
function v128.q15mulr_sat<T>(a: v128, b: v128): v128
Performs the line-wise saturating rounding multiplication in Q15 format ((a[i] * b[i] + (1 << (Q - 1))) >> Q where Q=15).
function v128.extmul_low<T>(a: v128, b: v128): v128
Performs the lane-wise integer extended multiplication of the lower lanes producing a twice wider result than the inputs.
function v128.extmul_high<T>(a: v128, b: v128): v128
Performs the lane-wise integer extended multiplication of the higher lanes producing a twice wider result than the inputs.
#Constructing constant vectors
function i8x16(a: i8, ... , p: i8): v128
Initializes a 128-bit vector from sixteen 8-bit integer values.

function i16x8(a: i16, ..., h: i16): v128
Initializes a 128-bit vector from eight 16-bit integer values.

function i32x4(a: i32, b: i32, c: i32, d: i32): v128
Initializes a 128-bit vector from four 32-bit integer values.

function i64x2(a: i64, b: i64): v128
Initializes a 128-bit vector from two 64-bit integer values.

function f32x4(a: f32, b: f32, c: f32, d: f32): v128
Initializes a 128-bit vector from four 32-bit float values.

function f64x2(a: f64, b: f64): v128
Initializes a 128-bit vector from two 64-bit float values.

#Relaxed SIMD 🦄
The following instructions represent the WebAssembly Relaxed SIMD (opens new window)specification. Must be enabled with --enable relaxed-simd.

function v128.relaxed_swizzle(a: v128, s: v128): v128
Selects 8-bit lanes from a using indices in s. Indices in the range [0-15] select the i-th element of a.

Unlike v128.swizzle, the result of an out of bounds index is implementation-defined, depending on hardware capabilities: Either 0 or a[s[i]%16].

function v128.relaxed_trunc<T>(a: v128): v128
Truncates each lane of a vector from 32-bit floating point to a 32-bit signed or unsigned integer as indicated by T.
Unlike v128.trunc_sat, the result of lanes out of bounds of the target type is implementation defined, depending on hardware capabilities:

If the input lane contains NaN, the result is either 0 or the respective maximum integer value.
If the input lane contains a value otherwise out of bounds of the target type, the result is either the saturatated result or maximum integer value.
function v128.relaxed_trunc_zero<T>(a: v128): v128
Truncates each lane of a vector from 64-bit floating point to a 32-bit signed or unsigned integer as indicated by T. Unused higher integer lanes of the result are initialized to zero.
Unlike v128.trunc_sat_zero, the result of lanes out of bounds of the target type is implementation defined, depending on hardware capabilities:

If the input lane contains NaN, the result is either 0 or the respective maximum integer value.
If the input lane contains a value otherwise out of bounds of the target type, the result is either the saturatated result or maximum integer value.
function v128.relaxed_madd<T>(a: v128, b: v128, c: v128): v128
Performs the fused multiply-add operation (a * b + c) on 32- or 64-bit floating point lanes as indicated by T.
The result is implementation defined, depending on hardware capabilities:

Either a * b is rounded once and the final result rounded again, or
The expression is evaluated with higher precision and only rounded once
function v128.relaxed_nmadd<T>(a: v128, b: v128, c: v128): v128
Performs the fused negative multiply-add operation (-(a * b) + c) on 32- or 64-bit floating point lanes as indicated by T.
The result is implementation defined, depending on hardware capabilities:

Either a * b is rounded once and the final result rounded again, or
The expression is evaluated with higher precision and only rounded once
function v128.relaxed_laneselect<T>(a: v128, b: v128, m: v128): v128
Selects 8-, 16-, 32- or 64-bit integer lanes as indicated by T from a or b based on masks in m.
Behaves like v128.bitselect if masks in m do have all bits either set (result is a[i]) or unset (result is b[i]). Otherwise the result is implementation-defined, depending on hardware capabilities: If the most significant bit of m is set, the result is either bitselect(a[i], b[i], mask) or a[i], otherwise the result is b[i].

function v128.relaxed_min<T>(a: v128, b: v128): v128
Computes the minimum of each 32- or 64-bit floating point lane as indicated by T.
Unlike v128.min, the result is implementation-defined if either value is NaN or both are -0.0 and +0.0, depending on hardware capabilities: Either a[i] or b[i].

function v128.relaxed_max<T>(a: v128, b: v128): v128
Computes the maximum of each 32- or 64-bit floating point lane as indicated by T.
Unlike v128.max, the result is implementation-defined if either value is NaN or both are -0.0 and +0.0, depending on hardware capabilities: Either a[i] or b[i].

function v128.relaxed_q15mulr<T>(a: v128, b: v128): v128
Performs the lane-wise rounding multiplication in Q15 format ((a[i] * b[i] + (1 << (Q - 1))) >> Q where Q=15).
Unlike v128.q15mulr_sat, the result is implementation-defined if both inputs are the minimum signed value: Either the minimum or maximum signed value.

function v128.relaxed_dot<T>(a: v128, b: v128): v128
Computes the dot product of two 8-bit integer lanes each, yielding lanes one size wider than the input.
Unlike v128.dot, if the most significant bit of b[i] is set, whether b[i] is interpreted as signed or unsigned by the intermediate multiplication is implementation-defined.

function v128.relaxed_dot_add<T>(a: v128, b: v128, c: v128): v128
Computes the dot product of two 8-bit integer lanes each, yielding lanes two sizes wider than the input with the lanes of c accumulated into the result.
Unlike v128.dot, if the most significant bit of b[i] is set, whether b[i] is interpreted as signed or unsigned by the intermediate multiplication is implementation-defined.

#Inline instructions
In addition to using the generic builtins above, most WebAssembly instructions can be written directly in AssemblyScript code. For example, the following is equivalent:

// generic builtin
v128.splat<i32>(42);

// inline instruction
i32x4.splat(42);