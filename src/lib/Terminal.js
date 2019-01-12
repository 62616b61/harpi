const colors = require('colors/safe');

const SPACE = ' ';
const BLACK_CELL = colors.bgBlack(SPACE);
const RED_CELL = colors.bgRed(SPACE);

const isOne = (x) => x === 1;
 
class Terminal {
  send(picture) {
    for(const row of picture) {
      console.log(row.map(cell => isOne(cell) ? RED_CELL : BLACK_CELL).join(SPACE))
    }
  }
}

module.exports = Terminal;
