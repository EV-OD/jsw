
export class Rect {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    area(): number {
        return this.width * this.height;
    }
}

export function createRect(x: number, y: number, w: number, h: number): Rect {
    "use wasm";
    return new Rect(x, y, w, h);
}

export function scaleRect(r: Rect, scale: number): Rect {
    "use wasm";
    return new Rect(r.x, r.y, r.width * scale, r.height * scale);
}

export function rectArea(r: Rect): number {
    "use wasm";
    return r.width * r.height;
}
