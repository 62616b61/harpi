const Matrix = require('./Matrix');
const Terminal = require('./Terminal');
const TickerTape = require('./TickerTape');
const { IS_ARM_ARCH } = require('../config/constants');

try {
  var Raspi = require('raspi-io');
  var five = require('johnny-five');
} catch (e) {}

function initBoard(events) {
  let output;

  const tickerTape = new TickerTape(events);

  if(IS_ARM_ARCH) {
    const board = new five.Board({
      repl: false,
      io: new Raspi(),
    });

    board.on('ready', () => {
      console.log('Board is ready')

      output = new five.ShiftRegister({
        isAnode: true,
        pins: {
          data: 'P1-11',
          clock: 'P1-15',
          latch: 'P1-13',
          reset: 'P1-7',
        },
      });
      output.reset();
      events.emit('ready');
    });
  } else {
    output = new Terminal();
    events.emit('ready');
  }

  const matrix = new Matrix(events, output);
}

module.exports = initBoard;
