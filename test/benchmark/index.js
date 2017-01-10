/* eslint-disable no-console */

const Benchmark = require('benchmark')
const bunyan = require('bunyan');
const WeLogger = require('../..');

var suite = new Benchmark.Suite();

const weLogger = new WeLogger({ stdout: false });
const bunyanLogger = bunyan.createLogger({ name: 'bunyan', streams: [] });

suite
  .add('we-js-logger', function() {
    weLogger.info('hello world')
  })
  .add('we-js-logger child', function() {
    const log = weLogger.child();
    log.info('hello world');
  })
  .add('bunyan', function() {
    bunyanLogger.info('hello world');
  })
  .add('bunyan child', function() {
    const log = bunyanLogger.child();
    log.info('hello world');
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