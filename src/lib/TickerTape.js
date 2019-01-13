const {
  transformTextToArrayOfArrays,
  shift,
  cutToSquare,
} = require('../utils/transform');

const STEP_INTERVAL = 100;
const DEFAULT_TEXT = ' hello world ';

class TickerTape {
  constructor(events) {
    this.events = events;

    this.queue = [];
    this.steps = 0;

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
    if (!this.queue.length) this.queue.push(DEFAULT_TEXT);

    this.picture = transformTextToArrayOfArrays(this.queue[0]);
    this.steps = 0;
    
    clearInterval(this.interval);
    this.interval = setInterval(() => this.step(), STEP_INTERVAL);
  }

  step() {
    if (this.steps === this.picture[0].length) {
      this.queue = this.queue.slice(1);
      this.start();

      return;
    }

    this.picture = shift(this.picture, 1);

    this.events.emit('draw', cutToSquare(this.picture))
    this.steps++;
  }

  subscribe() {
    this.events.on('ready', () => this.start());
    this.events.on('text', (text) => this.queue.push(' ' + text));
  }
}

module.exports = TickerTape;
