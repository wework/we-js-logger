import { iterate } from 'leakage';
import Logger from '../../../';


describe('Heap Tests - we-js-logger', function() {
  let log;

  beforeEach(() => {
    log = new Logger({ stdout: false });
  });

  it('does not leak when logging 1k times', function() {
    this.timeout(20000);
    iterate(1000, () => {
      log.info('log time');
    });
  });

  it('does not leak when building and logging child 1k times', function() {
    this.timeout(20000);
    iterate(1000, () => {
      const child = log.child();
      child.info('child time');
    });
  });
});

