/**
 * This test spins up a very basic express server
 * with the we-js-logger request logger middleware,
 * and measures request performance under load.
 */

const express = require('express');
const loadtest = require('loadtest');
const Logger = require('../..');

const PORT = 3030;
const TEST_LENGTH = 30; // seconds

const logger = new Logger({
  stdout: false,
  scrubFields: ['test'],
});

let count = 0;
const app = express();
app.use(logger.requestLogger);
app.get('*', (req, res) => {
  count += 1;

  req.log.info(
    { data: { test: 'super secret' } },
    'every request logs',
    { test: 'big secret', count }
  );
  res.status(200).send();
});

const loadOptions = {
  url: `http://localhost:${PORT}`,
  // Run stress test for this long.
  maxSeconds: TEST_LENGTH,
  // Simulate this number of concurrent clients
  concurrency: 10,
  // Each making this number of requests per second
  requestsPerSecond: 20,
};

function printResults(results) {
  // eslint-disable-next-line no-console
  console.log(
`
Completed requests: ${results.totalRequests}
Requests per second: ${results.rps}
Total time: ${results.totalTimeSeconds}
Mean latency: ${results.meanLatencyMs}

Percentage of requests served within a certain time:
  50%   ${results.percentiles['50']}ms
  90%   ${results.percentiles['90']}ms
  95%   ${results.percentiles['95']}ms
  99%   ${results.percentiles['99']}ms
  100%  ${results.maxLatencyMs}ms (longest request)
`
  );
}


describe('Request Logger -- Stress Test', function () {
  // `loadtest` requests come in after the set test time -- give a little extra room here
  this.timeout((TEST_LENGTH + 10) * 1000);

  let listener;
  before((done) => {
    listener = app.listen(PORT, done);
  });

  after((done) => {
    listener.close(done);
  });

  it('express server with requestLogger and scrubFields does not lock up under load', (done) => {
    // Retry a few times in case of result variance
    this.retries(4);

    loadtest.loadTest(loadOptions, (error, results) => {
      if (error) {
        done(error);
        return;
      }

      printResults(results);

      expect(results.totalErrors).to.eql(0, 'there are no request errors');
      expect(results.meanLatencyMs).to.be.lte(10, 'mean response is less than 10ms');
      expect(results.percentiles['99']).to.be.lte(20, '99% of responses under 20ms');
      expect(results.maxLatencyMs).to.be.lte(40, 'max response is less than 40ms');
      done();
    });
  });
});
