# JSW (JavaScript to WebAssembly Toolchain)

JSW is a high-performance toolchain designed to bridge the gap between high-level JavaScript/TypeScript development and the raw performance of WebAssembly. It abstracts the complexities of Wasm memory management and compilation, allowing developers to write compute-heavy logic in a TypeScript-like syntax that compiles directly to efficient WebAssembly binaries.

![Benchmark Results](./public/Pasted%20image%2020260107181924.png)
![Sample code](./public/Pasted%20image%2020260107195859.png)



## 🚀 Features

*   **Seamless Compilation**: Compiles TypeScript-like source code into optimized WebAssembly binaries.
*   **Automated Glue Code**: Generates the necessary JavaScript bindings to interact with Wasm modules effortlessly.
*   **Efficient Memory Management**: Handles linear memory allocation and pointer passing, abstracting `WebAssembly.Memory` synchronization.
*   **Zero-Cost Interop**: Optimized for numeric array transmission between the JS heap and Wasm linear memory.
*   **Performance Focused**: Designed specifically for CPU-bound tasks like Physics engines, AI/ML inference, and Cryptography.

## 📊 Benchmark: Neural Network Training

To validate JSW, this repository includes a comprehensive generic Neural Network benchmark comparing pure V8 JavaScript execution against JSW-compiled WebAssembly.

### The Test
A linear classification task using a fully connected neural network (Input: 2, Hidden: 5, Output: 2) trained via backpropagation on a 300-point dataset.

### The Results
On average (over 100 iterations):
*   **JS Execution Time**: ~80.70 ms
*   **JSW Execution Time**: ~36.30 ms
*   **Speedup factor**: **~2.2x - 3x faster**

> "JSW proves that we don't need to rewrite our entire stack in Rust or C++ to get Wasm benefits. We just need better tooling to compile our existing logic."

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/EV-OD/jsw

# Install dependencies
npm install
# or
pnpm install
```

## 💻 Usage

### Build the Project
Compile the internal AssemblyScript modules and generate the bindings:

```bash
npm run build
```

### Run the Benchmark
The project includes a visual playground to test the performance difference in real-time.

```bash
# Start a local server (using Vite, http-server, etc.)
npx vite
```

Navigate to `http://localhost:3000/tests/train_compare.html` to run the interactive benchmark.

## 📂 Project Structure

*   `src/`: Core logic and source files.
    *   `pure_backend.ts`: The reference implementation in pure JavaScript/TypeScript.
    *   `wasm_backend.ts`: The bridge to the JSW-compiled WebAssembly module.
*   `assembly/`: The source code destined for WebAssembly compilation.
*   `jsw-plugin/`: The core JSW compiler and code generation tools.
*   `tests/`: Interactive HTML benchmarks and visualization tools.

## 🤝 Contributing

Contributions are welcome! Please submit a Pull Request or open an Issue for bug reports and feature requests.

## 📄 License
MIT
