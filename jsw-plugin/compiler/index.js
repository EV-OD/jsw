
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export function compileAS(asCode) {
    if (!fs.existsSync('assembly')) fs.mkdirSync('assembly');
    fs.writeFileSync('assembly/generated.ts', asCode);

    console.log('[jsw] Compiling to Wasm...');
    try {
        if (!fs.existsSync('public')) fs.mkdirSync('public');
        const ascPath = path.resolve('node_modules/.bin/asc');
        execSync(`${ascPath} assembly/generated.ts --target release --exportRuntime --exportTable --outFile public/jsw.wasm`, { stdio: 'inherit' });
        return true;
    } catch (e) {
        console.error('[jsw] Compilation failed', e);
        return false;
    }
}
