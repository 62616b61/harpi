const {
  transformTextToArrayOfArrays,
  shift,
  cutToSquare,
} = require('../utils/transform');

const STEP_INTERVAL = 80;

class TickerTape {
  constructor(events) {
    this.events = events;

    this.text = 'Hello World! ';

    this.subscribe();
    this.start();
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
    this.picture = transformTextToArrayOfArrays(this.text);
    
    clearInterval(this.interval);
    this.interval = setInterval(() => this.step(), STEP_INTERVAL);
  }

  step() {
    this.picture = shift(this.picture, 1);

    this.events.emit('draw', cutToSquare(this.picture))
  }

  subscribe() {
    //this.events.on('draw', (picture) => this.setPicture(picture));
  }
}

module.exports = TickerTape;
