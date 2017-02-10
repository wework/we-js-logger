import scrub from '../../../src/util/common/scrub';

// FIXME stub out `hideSecrets` -- doesn't seem to be working on first pass
// import * as hideSecretsModule from 'hide-secrets';

// TODO test special `handleContext` behavior

describe('util/common/scrub', () => {
  let args;
  beforeEach(() => {
    args = ['test', 'args', 'are', 'so', { fun: 'yay' }];
  });

  it('returns args if no config.scrubFields are present', () => {
    const result = scrub(args, { scrubFields: [] });
    expect(result).to.eql(args);
  });

  it('passes args through hide-secrets if config.scrubFields are present', () => {
    const result = scrub(args, { scrubFields: ['fun'] });
    expect(result).to.eql(['test', 'args', 'are', 'so', { fun: '[SECRET]' }]);
  });
});
