
import { defineConfig } from 'vite';
import jswPlugin from './jsw-plugin/index.js';

export default defineConfig({
    plugins: [jswPlugin()],
    server: {
        port: 3000
    },
    build: {
        target: 'esnext' // Needed for top-level await
    }
});
