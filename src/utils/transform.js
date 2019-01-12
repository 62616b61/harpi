const { intToBin } = require('./convert');

function transformToArrayOfArrays(picture) {
  return picture.map(row => intToBin(row).split('').map(x => parseInt(x)));
}

function shift(picture, step) {
  return picture.map(row => {
    const shifted = row.shift(step);
    
    return row.concat(shifted);
  });
}

module.exports = {
  transformToArrayOfArrays,
  shift,
}
