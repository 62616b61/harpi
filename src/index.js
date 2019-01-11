const Raspi = require('raspi-io');
const five = require('johnny-five');

const Matrix = require('./src/Matrix');

const events = new EventEmitter()

const board = new five.Board({
  repl: false,
  io: new Raspi(),
})

board.on('ready', () => {
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
})
