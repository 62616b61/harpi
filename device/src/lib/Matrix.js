const { transformArrayOfArraysToString } = require('../utils/transform');
const { IS_ARM_ARCH } = require('../config/constants');

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

function toMatrixFormat (picture) {
  return picture.map((col, row) => {
    const row_swap_rule = [9 , 14, 8 , 12, 1 , 7 , 2 , 5];
    const col_swap_rule = [13, 3 , 4 , 10, 6 , 11, 15, 16];
  
    const col_swap = invert(col);
  
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
  });
}

class Matrix {
  constructor (events) {
    this.events = events;
    this.cache = {};

    this.subscribe();
    this.setPicture(DEFAULT_PICTURE);
  }

  display () {
    if (IS_ARM_ARCH) {
      const key = transformArrayOfArraysToString(this.picture);
      const cachedValue = this.cache[key];

      let formattedPicture;
      if (cachedValue) {
        formattedPicture = cachedValue;
      } else {
        formattedPicture = toMatrixFormat(this.picture);
        this.cache[key] = formattedPicture;
      }

      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.events.emit('send', formattedPicture);
      }, 1);
    } else {
      this.events.emit('send', this.picture);
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
