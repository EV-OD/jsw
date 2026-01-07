export interface Matrix {
  rows: number;
  cols: number;
  data: number[];
}

export function multiplyMatrix(m1: Matrix, m2: Matrix): Matrix {
  "use wasm";
  // console.log("Wasm: multiplyMatrix called");
  // console.log("m1 rows: " + m1.rows.toString());
  // console.log("m2 cols: " + m2.cols.toString());
  
  if (m1.cols != m2.rows) {
    // console.log("Dimension mismatch!");
    return { rows: 0, cols: 0, data: [] };
  }

  let rows = <i32>m1.rows;
  let cols = <i32>m2.cols;
  let common = <i32>m1.cols;
  
  let size = rows * cols;
  let data = new Array<number>(size);
  
  for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
          let sum: f64 = 0;
          for (let k = 0; k < common; k++) {
              let idx1 = i * common + k;
              let idx2 = k * cols + j;
              sum += m1.data[idx1] * m2.data[idx2];
          }
          data[i * cols + j] = sum;
      }
  }

  return {
    rows: rows,
    cols: cols,
    data: data
  };
}
