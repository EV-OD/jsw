// Helper for integer casting in Wasm
function toInt(n: number): number {
    return <i32>n;
}

export function findPathWasm(width: number, height: number, walls: number[], startX: number, startY: number, endX: number, endY: number): number[] {
    "use wasm";
    
    let w = <i32>width;
    let h = <i32>height;
    let size = w * h;
    
    let gScores = new Array<number>(size);
    let fScores = new Array<number>(size);
    let parents = new Array<number>(size);
    let closed = new Array<number>(size);
    let visited = new Array<number>(size);

    for (let i = 0; i < size; i++) {
        gScores[i] = 0;
        fScores[i] = 0;
        parents[i] = -1;
        closed[i] = 0;
        visited[i] = 0;
    }

    let startIdx = <i32>startY * w + <i32>startX;
    let endIdx = <i32>endY * w + <i32>endX;

    let openSet = new Array<number>(0);
    openSet.push(startIdx);
    visited[startIdx] = 1;

    let neighborsX = [0, 0, -1, 1];
    let neighborsY = [-1, 1, 0, 0];

    while (openSet.length > 0) {
        // Inline Selection Sort
        let len = openSet.length;
        // Optimization: We only need the minimum element.
        // If we just find min and swap to front (or shift), we don't need full sort?
        // But A* might need openSet sorted/maintained? 
        // Standard A* extracts Min.
        // So finding Min is O(N). Full sort is O(N^2).
        // Let's just find Min and remove it.
        // openSet is Array.
        
        let bestIdx = -1;
        let bestVal = 999999999.0; // Infinity
        let bestPos = -1;
        
        for (let i = 0; i < len; i++) {
            let nodeIdx = <i32>openSet[i];
            let val = fScores[nodeIdx];
            if (val < bestVal) {
                bestVal = val;
                bestIdx = nodeIdx;
                bestPos = i;
            }
        }
        
        // Remove bestPos
        // openSet.splice(bestPos, 1); // Splice might be slow/unsupported in AS pure?
        // AS has splice.
        // Or swap with end and pop? Order matters for tie-breaking but usually fine.
        // Using splice to be safe.
        // But simpler: just use full sort logic replacement or swap-remove.
        // To keep it identical to previous logic (shift from front of sorted), I should probably sort or maintain order.
        // But swap-to-front and shift is same as find-min-and-remove.
        
        // Let's swap best to 0, then shift.
        if (bestPos != -1) {
            let tmp = openSet[0];
            openSet[0] = openSet[bestPos];
            openSet[bestPos] = tmp;
        }
        // Now openSet[0] is min.
        // Warning: The rest of the array is NOT sorted.
        // Does subsequent iteration require sortedness?
        // A* requires picking node with lowest fScore. Yes.
        // Does it require others to be sorted? No.
        // So finding min is sufficient.
        
        let currentIdx = <i32>openSet.shift();
        
        if (currentIdx == endIdx) {
            let path = new Array<number>(0);
            let curr = currentIdx;
            
            while (curr != -1) {
                let y = <i32>(curr / w); 
                let x = <i32>(curr % w);
                path.push(y);
                path.push(x);
                curr = <i32>parents[curr];
            }
            return path;
        }

        closed[currentIdx] = 1;
        
        let cx = <i32>(currentIdx % w);
        let cy = <i32>(currentIdx / w);

        for (let i = 0; i < 4; i++) {
            let nx = cx + neighborsX[i];
            let ny = cy + neighborsY[i];

            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                let nIdx = ny * w + nx;
                
                if (walls[nIdx] == 1) continue;
                if (closed[nIdx] == 1) continue;

                let gScore = gScores[currentIdx] + 1;

                if (visited[nIdx] == 0 || gScore < gScores[nIdx]) {
                    parents[nIdx] = currentIdx;
                    gScores[nIdx] = gScore;
                    
                    let hx = 0;
                    let hy = 0;
                    let eX = <i32>endX;
                    let eY = <i32>endY;
                    if (nx > eX) hx = nx - eX; else hx = eX - nx;
                    if (ny > eY) hy = ny - eY; else hy = eY - ny;
                    
                    fScores[nIdx] = gScore + hx + hy;

                    if (visited[nIdx] == 0) {
                        visited[nIdx] = 1;
                        openSet.push(nIdx);
                    }
                }
            }
        }
    }
    return new Array<number>(0);
}
