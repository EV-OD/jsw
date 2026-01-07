import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Run wasm-opt with configurable options and simple budget checks.
 *
 * options: {
 *   args: string[]        // extra args to pass to wasm-opt (appended)
 *   preset: 'O3'|'O2'     // preset used in default args
 *   sizeBudgetKB: number  // maximum allowed delta in KB for optimized output (optional)
 *   fallbackArgs: string[]// args to try if first run increases size beyond budget
 * }
 */
export function runWasmOpt(inputPath, outputPath, options = {}) {
    try {
        const inP = path.resolve(inputPath);
        const outP = path.resolve(outputPath);

        // Check availability
        const which = spawnSync('command', ['-v', 'wasm-opt'], { shell: true });
        if (which.status !== 0) {
            console.warn('[jsw] wasm-opt not found in PATH, skipping wasm postprocessing.');
            return { ok: false, reason: 'wasm-opt-missing' };
        }

        const preset = options.preset || 'O3';
        const baseArgs = [inP, `-${preset}`, '--vacuum', '--dce', '--inlining-optimizing'];
        if (options.enableSIMD !== false) baseArgs.push('--enable-simd');

        const userArgs = Array.isArray(options.args) ? options.args : [];
        const args = [...baseArgs, '-o', outP, ...userArgs];

        console.log('[jsw] Running wasm-opt:', 'wasm-opt', args.join(' '));
        const res = spawnSync('wasm-opt', args, { stdio: 'inherit' });
        if (res.status !== 0) {
            console.error('[jsw] wasm-opt failed with exit code', res.status);
            return { ok: false, reason: 'wasm-opt-failed', code: res.status };
        }

        if (!fs.existsSync(outP) || fs.statSync(outP).size === 0) {
            return { ok: false, reason: 'empty-output' };
        }

        // If a size budget is provided, ensure we didn't grow the wasm too much.
        const sizeBudgetKB = typeof options.sizeBudgetKB === 'number' ? options.sizeBudgetKB : null;
        if (sizeBudgetKB !== null) {
            const inSize = fs.existsSync(inP) ? fs.statSync(inP).size : 0;
            const outSize = fs.statSync(outP).size;
            const deltaKB = (outSize - inSize) / 1024;
            if (deltaKB > sizeBudgetKB) {
                console.warn(`[jsw] wasm-opt output grew by ${deltaKB.toFixed(1)} KB which exceeds budget ${sizeBudgetKB} KB`);
                // If fallback args provided, try again with them
                if (Array.isArray(options.fallbackArgs) && options.fallbackArgs.length > 0) {
                    console.log('[jsw] Re-running wasm-opt with fallback args to reduce code size.');
                    const fallbackOut = outP + '.fb';
                    const fallbackArgs = [...baseArgs, '-o', fallbackOut, ...options.fallbackArgs];
                    const res2 = spawnSync('wasm-opt', fallbackArgs, { stdio: 'inherit' });
                    if (res2.status === 0 && fs.existsSync(fallbackOut) && fs.statSync(fallbackOut).size > 0) {
                        const fbSize = fs.statSync(fallbackOut).size;
                        const fbDeltaKB = (fbSize - inSize) / 1024;
                        if (fbDeltaKB <= sizeBudgetKB) {
                            fs.renameSync(fallbackOut, outP);
                            return { ok: true, reason: 'fallback-used' };
                        } else {
                            // fallback didn't help, remove it
                            fs.unlinkSync(fallbackOut);
                        }
                    }
                }
                // If we get here, optimization produced too-large output. Signal smaller optimization recommended.
                return { ok: false, reason: 'size-budget-exceeded', deltaKB };
            }
        }

        return { ok: true };
    } catch (e) {
        console.error('[jsw] wasm-opt error', e);
        return { ok: false, reason: 'exception', error: e };
    }
}

export default runWasmOpt;
