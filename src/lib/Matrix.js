const { MATRIX_CHARS } = require('./chars');

const IS_ARM_ARCH = process.arch === 'arm';
const DEFAULT_PICTURE = [
  [0, 0, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 1, 1, 1],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
];

const invert = bits => bits.map(bit => bit === 0 ? 1 : 0);

function toMatrixFormat (row, cols) {
  if (cols.every(col => col === 0)) {
    return [];
  }

  const row_swap_rule = [9 , 14, 8 , 12, 1 , 7 , 2 , 5];
  const col_swap_rule = [13, 3 , 4 , 10, 6 , 11, 15, 16];

  const col_swap = invert(cols);

  const result = new Array(16).fill(0);

  result[row_swap_rule[row] - 1] = 1;
  col_swap.forEach((value, i) => {
    result[col_swap_rule[i] - 1] = value;
  })

  const result_p1 = result.splice(0, 8).reverse();
  const result_p2 = result.splice(-8, 8);

  return [
    parseInt( result_p2.join('') , 2),
    parseInt( result_p1.join('') , 2),
  ];
}

class Matrix {
  constructor (events, register) {
    this.register = register;
    this.events = events;


    this.subscribe();
    this.setPicture(DEFAULT_PICTURE);
  }

  display () {
    if (IS_ARM_ARCH) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.picture.forEach((col, row) => {
          this.register.send(this.toMatrixFormat(row, col));
        });
      }, 1);
    } else {
      this.register.send(this.picture);
    }
  }

  setPicture (picture) {
    this.picture = picture;
    this.display();
  }


  subscribe () {
    this.events.on('draw', (picture) => this.setPicture(picture));
  }
}

module.exports = Matrix;
