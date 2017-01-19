/* eslint-disable no-console */

const Benchmark = require('benchmark')
const bunyan = require('bunyan');
const WeLogger = require('../..');

var suite = new Benchmark.Suite();

const weLogger = new WeLogger({ stdout: false });
const weLoggerScrub = new WeLogger({ stdout: false, scrubFields: ['foo'] });
const bunyanLogger = bunyan.createLogger({ name: 'bunyan', streams: [] });

const context = {
  data: { some: 'stuff' },
  foo: 'bar'
};
const msg = 'hello world';
const msgExtra = { pretty: 'print me please' };

suite
  .add('we-js-logger', function() {
    weLogger.info(context, msg, msgExtra);
  })
  .add('we-js-logger child', function() {
    const log = weLogger.child();
    log.info(context, msg, msgExtra);
  })
  .add('we-js-logger (with scrub fields)', function() {
    weLoggerScrub.info(context, msg, msgExtra)
  })
  .add('we-js-logger child (with scrub fields)', function() {
    const log = weLoggerScrub.child();
    log.info(context, msg, msgExtra);
  })
  .add('bunyan', function() {
    bunyanLogger.info(context, msg, msgExtra);
  })
  .add('bunyan child', function() {
    const log = bunyanLogger.child();
    log.info(context, msg, msgExtra);
  })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });