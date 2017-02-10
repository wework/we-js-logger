import logForLevel from '../../../src/util/common/logForLevel';
import * as scrubModule from '../../../src/util/common/scrub';

describe('util/common/logForLevel', () => {
  it('returns a function', () => {
    expect(logForLevel()).to.be.a('function');
  });

  describe('log method', () => {
    let logIt;
    let ctx;

    beforeEach(() => {
      ctx = {
        _logger: {
          info: sinon.spy(),
        },
        _config: {},
      };
      logIt = logForLevel('info').bind(ctx);
    });

    it("calls the internal logger's `level` log method", () => {
      logIt();
      expect(ctx._logger.info).to.have.been.calledOnce;
    });

    it('passes all arguments through', () => {
      const args = ['foo', 'bar', 'baz', 'BAM!', {}];
      logIt(...args);

      expect(ctx._logger.info).to.have.been.calledWith(...args);
    });

    it('calls scrub on the arguments', () => {
      sinon.stub(scrubModule, 'default');

      const args = ['foo', 'bar', 'baz', 'BAM!', {}];
      logIt(...args);

      expect(scrubModule.default).to.have.been.calledWith(args, ctx._config);
    });
  });
});
