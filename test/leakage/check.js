import { iterate } from 'leakage';
import bunyan from 'bunyan';
import Logger from '../..';

const TIMEOUT = 90 * 1000;
const ITERATIONS = 60;

describe('Heap Tests', () => {
  let log;

  describe('we-js-logger', () => {
    beforeEach(() => {
      log = new Logger({ stdout: false });
    });

    it(`does not leak when logging ${ITERATIONS} times`, function () {
      this.timeout(TIMEOUT);
      iterate(() => {
        log.info({}, 'log time', {});
      }, { iterations: ITERATIONS });
    });

    it(`does not leak when building and logging child ${ITERATIONS} times`, function () {
      this.timeout(TIMEOUT);
      iterate(() => {
        const child = log.child();
        child.info({}, 'child time', {});
      }, { iterations: ITERATIONS });
    });
  });

  describe('we-js-logger (with scrub fields)', () => {
    beforeEach(() => {
      log = new Logger({ stdout: false, scrubFields: ['foo'] });
    });

    it(`does not leak when logging ${ITERATIONS} times`, function () {
      this.timeout(TIMEOUT);
      iterate(() => {
        log.info({}, 'log time', {});
      }, { iterations: ITERATIONS });
    });

    it(`does not leak when building and logging child ${ITERATIONS} times`, function () {
      this.timeout(TIMEOUT);
      iterate(() => {
        const child = log.child();
        child.info({}, 'child time', {});
      }, { iterations: ITERATIONS });
    });
  });

  // Unskip if you want to compare to raw bunyan
  describe.skip('bunyan', () => {
    beforeEach(() => {
      log = new bunyan.createLogger({ name: 'test', streams: [] }); // eslint-disable-line new-cap
    });

    it(`does not leak when logging ${ITERATIONS} times`, function () {
      this.timeout(TIMEOUT);
      return iterate(() => {
        log.info({}, 'log time', {});
      }, { iterations: ITERATIONS });
    });

    it(`does not leak when building and logging child ${ITERATIONS} times`, function () {
      this.timeout(TIMEOUT);
      return iterate(() => {
        const child = log.child();
        child.info({}, 'child time', {});
      }, { iterations: ITERATIONS });
    });
  });
});

