
// Helper for integer casting in Wasm
function int(n: number): number {
    return n | 0;
}

export function findPathWasm(width: number, height: number, walls: number[], startX: number, startY: number, endX: number, endY: number): number[] {
    "use wasm";
    
    let size = int(width * height);
    
    // Flat arrays for node properties
    let gScores = new Array<number>(size);
    let fScores = new Array<number>(size);
    let parents = new Array<number>(size);
    let closed = new Array<number>(size);
    let visited = new Array<number>(size);

    // Initialization
    for (let i = 0; i < size; i++) {
        gScores[i] = 0;
        fScores[i] = 0;
        parents[i] = -1;
        closed[i] = 0;
        visited[i] = 0;
    }

    let startIdx = int(startY * width + startX);
    let endIdx = int(endY * width + endX);

    let openSet = new Array<number>(0);
    openSet.push(startIdx);
    visited[startIdx] = 1;

    // Pre-allocate neighbors arrays to avoid GC in loop
    let neighborsX = [0, 0, -1, 1];
    let neighborsY = [-1, 1, 0, 0];

    while (openSet.length > 0) {
        // Sort by fScore (ascending)
        openSet.sort((a, b) => {
            let fa = fScores[int(a)];
            let fb = fScores[int(b)];
            if (fa < fb) return -1;
            if (fa > fb) return 1;
            return 0;
        });

        let currentIdx = int(openSet.shift());
        
        if (currentIdx == endIdx) {
            // Reconstruct path
            let path = new Array<number>(0);
            let curr = currentIdx;
            
            while (curr != -1) {
                let y = int(curr / width); 
                let x = int(curr % width);
                path.push(y);
                path.push(x);
                curr = int(parents[int(curr)]);
            }
            return path;
        }

        closed[currentIdx] = 1;
        
        let cx = int(currentIdx % width);
        let cy = int(currentIdx / width);

        for (let i = 0; i < 4; i++) {
            let nx = int(cx + neighborsX[i]);
            let ny = int(cy + neighborsY[i]);

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                let nIdx = int(ny * width + nx);
                
                if (walls[nIdx] == 1) continue;
                if (closed[nIdx] == 1) continue;

                let gScore = gScores[currentIdx] + 1;

                if (visited[nIdx] == 0 || gScore < gScores[nIdx]) {
                    parents[nIdx] = currentIdx;
                    gScores[nIdx] = gScore;
                    
                    // Heuristic
                    let hx = 0;
                    let hy = 0;
                    if (nx > endX) hx = nx - endX; else hx = endX - nx;
                    if (ny > endY) hy = ny - endY; else hy = endY - ny;
                    
                    fScores[nIdx] = gScore + hx + hy;

                    if (visited[nIdx] == 0) {
                        visited[nIdx] = 1;
                        openSet.push(nIdx);
                    }
                }
            }
        }
    }

    return [];
}
