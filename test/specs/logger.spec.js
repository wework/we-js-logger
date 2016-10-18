// Require the package. For client tests, webpack should resolve to the browser version automatically.
import _ from 'lodash';
import bunyan from 'bunyan';

import Logger from '../../';
import TestLogger from '../testLogger';

// Logentries validates this token, this is fake one in an acceptable format
const fakeToken = '00000000-0000-0000-0000-000000000000';

describe('we-js-logger', () => {
  it('exports a "class"', () => {
    expect(Logger).to.be.a('function');
    expect(new Logger()).to.be.ok;
  });

  describe('options', () => {
    it('accepts a level', () => {
      const info = new Logger({ level: 'info' });
      const debug = new Logger({ level: 'debug' });
      const fatal = new Logger({ level: 'fatal' });

      expect(info._level).to.equal(bunyan.INFO);
      expect(debug._level).to.equal(bunyan.DEBUG);
      expect(fatal._level).to.equal(bunyan.FATAL);
    });

    it('accepts a name', () => {
      const name = 'WeTest!';
      const log = new Logger({ name });

      expect(log.fields.name).to.equal(name);
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
            stream: new TestLogger({ cb })
          }
        ]
      });

      expect(log.streams.filter((config) => {
        return config.stream instanceof TestLogger;
      }), 'Adds the custom stream').to.be.ok;

      expect(log.streams).to.have.length.gte(1, 'Has more than one stream');

      log.debug({ foo: 'bar' }, msg);
      expect(cb.lastCall.args[0]).to.include({
        name,
        msg,
        foo: 'bar'
      }, 'Uses the custom stream');
    });

    it('accepts a stdout flag', () => {
      expect(new Logger({ stdout: false }).streams).to.have.length(0);

      // The actual stdout stream differs based on runtime env, just
      // asserting is is there.
      expect(new Logger({ stdout: true }).streams).to.have.length(1);
    });

    it('accepts a logentriesToken', () => {
      expect(new Logger().streams.find((config) => {
        return config.name === 'logentries';
      })).to.not.be.ok;

      const log = new Logger({
        logentriesToken: fakeToken
      });

      // The actual logentries steam differs based on runtime env, just
      // asserting one is there
      expect(log.streams.find((config) => {
        return config.name === 'logentries';
      })).to.be.ok;
    });

    it('accepts a rollbarToken', () => {
      expect(new Logger().streams.find((config) => {
        return config.name === 'rollbar';
      })).to.not.be.ok;

      const log = new Logger({
        rollbarToken: fakeToken
      });

      // The actual rollbar steam differs based on runtime env, just
      // asserting one is there
      expect(log.streams.find((config) => {
        return config.name === 'rollbar';
      })).to.be.ok;
    });

    it.skip('accepts an environment', () => {});
    it.skip('accepts a codeVersion', () => {});
    it.skip('accepts custom serializers', () => {});
  });

  describe('instance', () => {
    let log;
    beforeEach(() => {
      log = new Logger();
    });

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

  describe.skip('Rollbar Transport', () => {});
  describe.skip('Logentries Transport', () => {});
});