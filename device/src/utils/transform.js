const { MATRIX_CHARS } = require('./chars');
const { intToBin } = require('./convert');

function transformCharToArrayOfArrays(char) {
  const picture = MATRIX_CHARS[char];

  return picture.map(row => intToBin(row).split('').map(x => parseInt(x)));
}

function concatArraysOfArrays(pictureA, pictureB) {
  return pictureA.map((row, i) => row.concat(pictureB[i]));
}

function transformTextToArrayOfArrays(text) {
  return text.split('').reduce((acc, char) => {
    if (!acc) {
      return transformCharToArrayOfArrays(char);
    } else {
      return concatArraysOfArrays(acc, transformCharToArrayOfArrays(char));
    }
  }, null);
}

function transformArrayOfArraysToString(picture) {
  const flat = [].concat.apply([], picture);
  return flat.join('');
}

function shift(picture, step) {
  return picture.map(row => {
    const shifted = row.shift(step);
    
    return row.concat(shifted);
  });
}

function cutToSquare(picture) {
  return picture.map(row => row.slice(0, 8));
}

module.exports = {
  transformTextToArrayOfArrays,
  transformArrayOfArraysToString,
  shift,
  cutToSquare,
}
