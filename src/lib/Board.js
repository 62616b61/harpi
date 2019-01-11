if (process.arch === 'arm') {
  const Raspi = require('raspi-io');
  const five = require('johnny-five');
}

function initRPiBoard(events) {
  const board = new five.Board({
    repl: false,
    io: new Raspi(),
  });

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
  
  board.on('ready', () => {
    console.log('Board is ready')
    const matrix = new Matrix(events, register);
  });
}

function initEmulator() {
  console.log('Emulator is ready')

}

module.exports = process.arch === 'arm' ? initRPiBoard : initEmulator;
