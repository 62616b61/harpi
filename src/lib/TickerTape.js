const {
  transformTextToArrayOfArrays,
  shift,
  cutToSquare,
} = require('../utils/transform');

const STEP_INTERVAL = 100;

class TickerTape {
  constructor(events) {
    this.events = events;

    this.text = 'hello world! ';

    this.subscribe();
  }

  display() {
    if (IS_ARM_ARCH) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.picture.forEach((col, row) => {
          this.register.send(this.toMatrixFormat(row, col));
        });
      }, 1);
    } else {
      this.register.send(this.picture);
    }
  }

  start() {
    console.log('Started Ticker Tape')
    this.picture = transformTextToArrayOfArrays(this.text);
    
    clearInterval(this.interval);
    this.interval = setInterval(() => this.step(), STEP_INTERVAL);
  }

  step() {
    this.picture = shift(this.picture, 1);

    this.events.emit('draw', cutToSquare(this.picture))
  }

  subscribe() {
    this.events.on('ready', () => this.start());
  }
}

module.exports = TickerTape;
