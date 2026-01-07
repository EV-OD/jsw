
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { runWasmOpt } from './wasmopt.js';

export function compileAS(asCode) {
    if (process.env.JSW_SKIP_WASM === '1') {
        console.log('[jsw] SKIP wasm compiler (JSW_SKIP_WASM=1)');
        // still write assembly file for debugging, but do not run asc
        if (!fs.existsSync('assembly')) fs.mkdirSync('assembly');
        fs.writeFileSync('assembly/generated.ts', asCode);
        return true;
    }
    if (!fs.existsSync('assembly')) fs.mkdirSync('assembly');
    fs.writeFileSync('assembly/generated.ts', asCode);

    console.log('[jsw] Compiling to Wasm...');
    try {
        if (!fs.existsSync('public')) fs.mkdirSync('public');
        const ascPath = path.resolve('node_modules/.bin/asc');
        execSync(`${ascPath} assembly/generated.ts --target release --exportRuntime --exportTable --outFile public/jsw.wasm`, { stdio: 'inherit' });

        // Attempt to optimize the produced wasm with wasm-opt (if available).
        try {
            const inWasm = 'public/jsw.wasm';
            const outWasm = 'public/jsw.opt.wasm';

            // Load wasmOpt config from package.json (optional)
            let wasmOptConfig = {};
            try {
                const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
                if (pkg && pkg.wasmOpt) wasmOptConfig = pkg.wasmOpt;
            } catch (e) {
                // ignore, use defaults
            }

            const res = runWasmOpt(inWasm, outWasm, wasmOptConfig);
            if (res && res.ok) {
                // Replace original with optimized version
                fs.renameSync(outWasm, inWasm);
                console.log('[jsw] Replaced public/jsw.wasm with wasm-opt optimized output.');
            } else {
                console.warn('[jsw] wasm-opt skipped or produced suboptimal output:', res && res.reason ? res.reason : res);
            }
        } catch (e) {
            console.warn('[jsw] wasm-opt postprocessing failed or skipped:', e && e.message ? e.message : e);
        }

        return true;
    } catch (e) {
        console.error('[jsw] Compilation failed', e);
        return false;
    }
}
