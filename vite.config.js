
import { defineConfig } from 'vite';
import jswPlugin from './jsw-plugin/index.js';
import { resolve } from 'path';

export default defineConfig({
    plugins: [jswPlugin()],
    server: {
        port: 3000
    },
    build: {
        target: 'esnext', // Needed for top-level await
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                basic: resolve(__dirname, 'tests/basic.html'),
                objects: resolve(__dirname, 'tests/objects.html'),
                callbacks: resolve(__dirname, 'tests/callbacks.html'),
                classes: resolve(__dirname, 'tests/classes.html'),
                matrix: resolve(__dirname, 'tests/matrix.html'),
                astar: resolve(__dirname, 'tests/astar.html'),
                benchmark: resolve(__dirname, 'tests/benchmark.html'),
            },
        },
    }
});
