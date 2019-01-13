const EventEmitter = require('events');
const Matrix = require('./lib/Matrix');
const Output = require('./lib/Output');
const TickerTape = require('./lib/TickerTape');

const events = new EventEmitter();

const tickerTape = new TickerTape(events);
const matrix = new Matrix(events);
const output = new Output(events);
