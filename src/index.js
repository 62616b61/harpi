const EventEmitter = require('events');
const initBoard = require('./lib/Board');

const events = new EventEmitter();

initBoard(events);
