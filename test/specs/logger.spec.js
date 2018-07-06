import bunyan, { stdSerializers } from 'bunyan';
import TestLogger from '../testLogger';

// Require the package. For client tests, webpack should
// resolve to the browser version automatically.
import Logger from '../..';

// Logentries validates the token it is passed,
// here is a fake one in an acceptable format
const fakeToken = '00000000-0000-0000-0000-000000000000';

describe('we-js-logger', () => {
  it('exports a "class"', () => {
    expect(Logger).to.be.a('function');
    expect(new Logger()).to.be.ok;
  });

  it('exposes "bunyanStdSerializers"', () => {
    expect(Logger.bunyanStdSerializers).to.eql(stdSerializers);
  });

  if (typeof document === 'undefined') {
    it('exposes the rollbar instance', () => {
      expect(new Logger()).to.have.property('rollbar');
    });
  }

  describe('options', () => {
    it('accepts a name', () => {
      const name = 'WeTest!';
      const log = new Logger({ name });

      expect(log._logger.fields.name).to.equal(name);
    });

    it('accepts custom streams', () => {
      const name = 'TestingCustomStream!';
      const level = 'debug';
      const msg = 'Testing!';
      const cb = sinon.stub();
      const log = new Logger({
        name,
        level,
        streams: [
          {
            type: 'raw',
            stream: new TestLogger({ cb }),
          },
        ],
      });

      expect(log._logger.streams.filter((config) => {
        return config.stream instanceof TestLogger;
      }), 'Adds the custom stream').to.be.ok;

      expect(log._logger.streams).to.have.length.gte(1, 'Has more than one stream');

      log.debug({ foo: 'bar' }, msg);
      expect(cb.lastCall.args[0]).to.include({
        name,
        msg,
        foo: 'bar',
      }, 'Uses the custom stream');

      // TODO test that logs at a higher level dont go to the transport
    });

    it('accepts a stdout flag', () => {
      expect(new Logger({ stdout: false })._logger.streams).to.have.length(0);

      // The actual stdout stream differs based on runtime env, just
      // asserting is is there.
      expect(new Logger({ stdout: true })._logger.streams).to.have.length(1);
    });

    it('accepts a logentriesToken', () => {
      expect(new Logger()._logger.streams.find((config) => {
        return config.name === 'logentries';
      })).to.not.be.ok;

      const log = new Logger({
        logentriesToken: fakeToken,
      });

      // The actual logentries stream differs based on runtime env, just
      // asserting one is there
      expect(log._logger.streams.find((config) => {
        return config.name === 'logentries';
      })).to.be.ok;
    });

    it('accepts a rollbarToken', () => {
      expect(new Logger()._logger.streams.find((config) => {
        return config.name === 'rollbar';
      })).to.not.be.ok;

      const log = new Logger({
        rollbarToken: fakeToken,
      });

      // The actual rollbar stream differs based on runtime env, just
      // asserting one is there
      expect(log._logger.streams.find((config) => {
        return config.name === 'rollbar';
      })).to.be.ok;
    });

    it.skip('accepts an environment', () => {});
    it.skip('accepts a codeVersion', () => {});
    it.skip('accepts custom serializers', () => {});
  });

  describe('config.scrubFields', () => {
    let log;

    beforeEach(() => {
      log = new Logger({
        release: { foo: 'bar' },
        scrubFields: [
          'scrubMe',
        ],
      });
      log._logger._emit = sinon.stub();
    });

    it('hides secrets for fields', () => {
      log.info({ data: { scrubMe: 'This should be ignored', tlc: 'No Scrubs' } });
      expect(log._logger._emit).to.have.been.calledOnce;
      expect(log._logger._emit.firstCall.args[0].data.scrubMe).to.equal('[SECRET]');
      expect(log._logger._emit.firstCall.args[0].data.tlc).to.equal('No Scrubs');
    });

    it('hides secrets for msg', () => {
      log.info('Testing Log', { scrubMe: 'This should be ignored', tlc: 'No Scrubs' });
      expect(log._logger._emit).to.have.been.calledOnce;
      expect(log._logger._emit.firstCall.args[0].msg).to.equal("Testing Log { scrubMe: '[SECRET]', tlc: 'No Scrubs' }");
    });

    describe('child log', () => {
      let childLog;

      beforeEach(() => {
        childLog = log.child({ component: 'child/test' });
        childLog._logger._emit = sinon.stub();
      });

      it('hides secrets for fields', () => {
        childLog.info({ data: { scrubMe: 'This should be ignored', tlc: 'No Scrubs' } });
        expect(childLog._logger._emit).to.have.been.calledOnce;
        expect(childLog._logger._emit.firstCall.args[0].data.scrubMe).to.equal('[SECRET]');
        expect(childLog._logger._emit.firstCall.args[0].data.tlc).to.equal('No Scrubs');
      });

      it('hides secrets for msg', () => {
        childLog.info('Testing Log', { scrubMe: 'This should be ignored', tlc: 'No Scrubs' });
        expect(childLog._logger._emit).to.have.been.calledOnce;
        expect(childLog._logger._emit.firstCall.args[0].msg).to.equal("Testing Log { scrubMe: '[SECRET]', tlc: 'No Scrubs' }");
      });
    });
  });


  describe('instance', () => {
    let log;

    beforeEach(() => {
      log = new Logger({
        release: { foo: 'bar' },
      });
    });

    describe('root fields', () => {
      it('has extra root fields "release" and "environment" by default', () => {
        expect(log._logger.fields).to.have.property('release');
        expect(log._logger.fields).to.have.property('environment');
      });

      it('does not have extra root fields, such as "rollbarToken"', () => {
        expect(log._logger.fields).not.to.have.property('rollbarToken');
        expect(log._logger.fields).not.to.have.property('logentriesToken');
        expect(log._logger.fields).not.to.have.property('scrubFields');
        expect(log._logger.fields).not.to.have.property('stdout');
      });

      it('can be configured to include any keys', () => {
        const customLog = new Logger({
          rootFields: [ 'badIdea' ],
          badIdea: 'supersecret',
          release: { foo: 'not gonna be included unless specified in rootFields' },
        });
        expect(customLog._logger.fields).to.have.property('badIdea');
        expect(customLog._logger.fields).not.to.have.property('release');
      });
    });

    describe('log methods', () => {
      it('has a #fatal method', () => {
        expect(log.fatal).to.be.a('function');
      });
      it('has a #error method', () => {
        expect(log.error).to.be.a('function');
      });
      it('has a #warn method', () => {
        expect(log.warn).to.be.a('function');
      });
      it('has a #info method', () => {
        expect(log.info).to.be.a('function');
      });
      it('has a #debug method', () => {
        expect(log.debug).to.be.a('function');
      });
      it('has a #trace method', () => {
        expect(log.trace).to.be.a('function');
      });
    });

    describe('#child', () => {
      it('calls child on the logger bunyan instance', () => {
        sinon.spy(bunyan.prototype, 'child');
        log.child();

        expect(bunyan.prototype.child).to.have.been.calledOnce;
      });

      it('instantiates a new logger with the new child', () => {
        const stubChild = {};
        sinon.stub(bunyan.prototype, 'child').returns(stubChild);
        const child = log.child();

        expect(child).not.to.eql(log);
        expect(child._logger).to.eql(stubChild);
      });

      it('instantiates a new logger with the same config', () => {
        const child = log.child();
        expect(child._config).to.eql(log._config);
      });
    });

    // FIXME find a better way to do this. Should we use `env-universal`?
    if (typeof document === 'undefined') {
      describe('node only', () => {
        it('exposes a requestLogger middleware', () => {
          expect(log.requestLogger).to.be.a('function');
        });
        it('exposes a rollbarErrorMiddleware middleware', () => {
          expect(log.rollbarErrorMiddleware).to.be.a('function');
        });
      });
    }
  });

  describe.skip('Rollbar Transport', () => {});

  describe.skip('Logentries Transport', () => {});
});
