const { MATRIX_CHARS } = require('./chars');
const { transformToArrayOfArrays, shift } = require('../utils/transform');

const STEP_INTERVAL = 100;

class TickerTape {
  constructor(events) {
    this.events = events;

    this.picture = transformToArrayOfArrays(MATRIX_CHARS['A']);

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
    clearInterval(this.interval);
    this.interval = setInterval(() => this.step(), STEP_INTERVAL);
  }

  step() {
    this.picture = shift(this.picture, 1);

    this.events.emit('draw', this.picture)
  }

  subscribe() {
    //this.events.on('draw', (picture) => this.setPicture(picture));
  }
}

module.exports = TickerTape;
