const colors = require('colors/safe');

const SPACE = ' ';
const BLACK_CELL = colors.bgBlack(SPACE);
const RED_CELL = colors.bgRed(SPACE);

const isOne = (x) => parseInt(x) === 1;

class Terminal {
  send(picture) {
    for(const row of picture) {
      const formattedString = row
        .map(cell => isOne(cell) ? RED_CELL : BLACK_CELL)
        .join(SPACE);

      console.log(formattedString);
    }
  }
}

module.exports = Terminal;
