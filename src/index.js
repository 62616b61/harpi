const EventEmitter = require('events');
const Matrix = require('./lib/Matrix');
const Output = require('./lib/Output');
const TickerTape = require('./lib/TickerTape');
const IOT = require('./lib/IOT');

const events = new EventEmitter();

const tickerTape = new TickerTape(events);
const matrix = new Matrix(events);
const output = new Output(events);
const iot = new IOT(events);
