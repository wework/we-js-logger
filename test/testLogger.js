/**
 * @module we-js-logger/test/testLogger
 * @description Custom rollbar stream for testing
 */

export default function TestLogger(opts) {
  this.cb = opts.cb;
}

TestLogger.prototype.write = function (data = {}) {
  this.cb(data);
};
