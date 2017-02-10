import Logger from '../..';
import TestLogger from '../testLogger';

import createRequestLogger from '../../src/util/server/requestLogger';

// Only run these tests in node
// FIXME find a better way to do this. Should we use `env-universal`?
if (typeof document === 'undefined') {
  describe('util/server/requestLogger', () => {
    describe('#createRequestLogger', () => {
      it('is a function', () => {
        expect(createRequestLogger).to.be.a('function');
      });

      it('returns a function', () => {
        expect(createRequestLogger()).to.be.a('function');
      });
    });

    describe('middleware', () => {
      let logger;
      let middleware;
      let cb;
      let req;
      let res;
      let next;

      beforeEach(() => {
        req = {
          get: sinon.stub(),
        };
        res = {
          setHeader: sinon.stub(),
          on: sinon.stub().yields(),
        };
        next = sinon.stub();

        cb = sinon.stub();

        logger = new Logger({
          stdout: false,
          streams: [
            { type: 'raw', stream: new TestLogger({ cb }) },
          ],
        });

        middleware = createRequestLogger(logger);
      });

      it('reads a request id from the x-request-id header (configurable)', () => {
        const testReqId = 'abcd1234';
        req.get.returns(testReqId);

        middleware(req, res, next);

        expect(cb.firstCall.args[0]).to.include({
          req_id: testReqId,
        });
      });

      it('generates an id if no x-request-id header is present on the request', () => {
        middleware(req, res, next);

        expect(cb.firstCall.args[0].req_id).to.be.ok;
      });

      it('logs a start request item', () => {
        middleware(req, res, next);

        expect(cb.firstCall.args[0]).to.include({
          msg: 'start request',
        });
      });

      it('logs an end request item', () => {
        middleware(req, res, next);
        expect(cb.lastCall.args[0]).to.include({
          msg: 'end request',
        });
      });

      it('includes the response time in the end request log', () => {
        middleware(req, res, next);

        const duration = cb.lastCall.args[0].duration;
        expect(duration).to.be.ok;
        expect(duration).to.be.gt(0);
      });

      it('sets a x-request-id header (configurable) on the response', () => {
        const testReqId = '1234abcd';
        req.get.returns(testReqId);

        middleware(req, res, next);

        res.setHeader.calledWith('x-request-id', testReqId);
      });

      it('calls next', () => {
        middleware(req, res, next);
        expect(next).to.have.been.calledOnce;
      });

      it('calls next immediately', () => {
        // Replace this stub with one that yields after a tick
        res.on = sinon.stub().yieldsAsync();

        middleware(req, res, next);
        expect(next).to.have.been.calledOnce;
      });

      it('attaches a `log` function to the request object', () => {
        // Don't yield here since the logger is cleared once the response is finished
        res.on = sinon.stub();
        middleware(req, res, next);

        expect(req.log).to.be.an('object');
        expect(req.log.info).to.be.a('function');
      });

      it('includes useful request information in the `req.log` fields', () => {
        const testReqId = '1234abcd';
        req.get.returns(testReqId);
        // Don't yield here since the logger is cleared once the response is finished
        res.on = sinon.stub();
        middleware(req, res, next);

        expect(req.log._logger.fields.component).to.eql('request');
        expect(req.log._logger.fields.req).to.eql(req);
        expect(req.log._logger.fields.req_id).to.eql(testReqId);
      });

      it('clears `req.log` after the response is finished', () => {
        middleware(req, res, next);
        expect(req.log).to.not.be.ok;
      });
    });
  });
}
