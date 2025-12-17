

export interface Matrix {
  rows: number;
  cols: number;
  data: number[];
}

export function multiplyMatrix(m1: Matrix, m2: Matrix): Matrix {
  "use wasm";
  console.log("Wasm: multiplyMatrix called");
  console.log("m1 rows: " + m1.rows.toString());
  console.log("m2 cols: " + m2.cols.toString());
  
  if (m1.cols != m2.rows) {
    console.log("Dimension mismatch!");
    return { rows: 0, cols: 0, data: [] };
  }

  let rows = m1.rows;
  let cols = m2.cols;
  let size = rows * cols;

  let result: Matrix = {
    rows: rows,
    cols: cols,
    data: new Array<number>(size)
  };
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let sum: number = 0;
      for (let k = 0; k < m1.cols; k++) {
        let idx1 = i * m1.cols + k;
        let idx2 = k * m2.cols + j;
        let val1 = m1.data[idx1];
        let val2 = m2.data[idx2];
        sum += val1 * val2;
      }
      let idxRes = i * cols + j;
      result.data[idxRes] = sum;
    }
  }
  
  return result;
}
