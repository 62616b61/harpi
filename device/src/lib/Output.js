const colors = require('colors/safe');
const { IS_ARM_ARCH } = require('../config/constants');

try {
  var Raspi = require('raspi-io');
  var five = require('johnny-five');
} catch (e) {}

const SPACE = ' ';
const BLACK_CELL = colors.bgBlack(SPACE);
const RED_CELL = colors.bgRed(SPACE);

const isOne = (x) => parseInt(x) === 1;

class Output {
  constructor(events) {
    this.events = events;

    if (IS_ARM_ARCH) {
      const board = new five.Board({
        repl: false,
        io: new Raspi(),
      });

      board.on('ready', () => {
        console.log('Board is ready')

        this.register = new five.ShiftRegister({
          isAnode: true,
          pins: {
            data: 'P1-11',
            clock: 'P1-15',
            latch: 'P1-13',
            reset: 'P1-7',
          },
        });
        this.register.reset();
        this.events.emit('ready');
      });
    } else {
      this.events.emit('ready');
    }

    this.subscribe();
  }

  send(picture) {
    if (IS_ARM_ARCH) {
      picture.forEach(row => this.register.send(row));
    } else {
      for(const row of picture) {
        const formattedString = row
          .map(cell => isOne(cell) ? RED_CELL : BLACK_CELL)
          .join(SPACE);

        console.log(formattedString);
      }
    }
  }

  subscribe() {
    this.events.on('send', (picture) => this.send(picture))
  }
}

module.exports = Output;
