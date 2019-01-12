const Matrix = require('./Matrix');
const Terminal = require('./Terminal');
const TickerTape = require('./TickerTape');

try {
  var Raspi = require('raspi-io');
  var five = require('johnny-five');
} catch (e) {}

function initRPiBoard(events) {
  const board = new five.Board({
    repl: false,
    io: new Raspi(),
  });

  board.on('ready', () => {
    console.log('Board is ready')

    const register = new five.ShiftRegister({
      isAnode: true,
      pins: {
        data: 'P1-11',
        clock: 'P1-15',
        latch: 'P1-13',
        reset: 'P1-7',
      },
    });
    register.reset();

    const matrix = new Matrix(events, register);
  });
}

function initTerminal(events) {
  const terminal = new Terminal();
  const matrix = new Matrix(events, terminal);
  const tickerTape = new TickerTape(events);
}

module.exports = process.arch === 'arm' ? initRPiBoard : initTerminal;
