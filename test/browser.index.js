const _ = require('lodash');
require('./runner');

// shim global rollbar
global.Rollbar = {
  options: {
    accessToken: 'testShim'
  },
  configure: _.noop,
  scope: _.noop,
  critical: _.noop,
  error: _.noop,
  warning: _.noop,
  info: _.noop,
  debug: _.noop,
  log: _.noop
};

// require all `/test/specs/**/*.js`
const testsContext = require.context('./specs/', true, /\.js$/);
testsContext.keys().forEach(testsContext);