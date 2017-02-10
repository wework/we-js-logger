/* eslint-disable no-console */

const Benchmark = require('benchmark');
const bunyan = require('bunyan');
const WeLogger = require('../..');

const suite = new Benchmark.Suite();

const weLogger = new WeLogger({ stdout: false });
const weLoggerScrub = new WeLogger({ stdout: false, scrubFields: ['foo'] });
const bunyanLogger = bunyan.createLogger({ name: 'bunyan', streams: [] });

const context = {
  data: { some: 'stuff' },
  foo: 'bar',
};
const msg = 'hello world';
const msgExtra = { pretty: 'print me please' };

suite
  .add('we-js-logger', () => {
    weLogger.info(context, msg, msgExtra);
  })
  .add('we-js-logger child', () => {
    const log = weLogger.child();
    log.info(context, msg, msgExtra);
  })
  .add('we-js-logger (with scrub fields)', () => {
    weLoggerScrub.info(context, msg, msgExtra);
  })
  .add('we-js-logger child (with scrub fields)', () => {
    const log = weLoggerScrub.child();
    log.info(context, msg, msgExtra);
  })
  .add('bunyan', () => {
    bunyanLogger.info(context, msg, msgExtra);
  })
  .add('bunyan child', () => {
    const log = bunyanLogger.child();
    log.info(context, msg, msgExtra);
  })
  // add listeners
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
  })
  // run async
  .run({ async: true });
