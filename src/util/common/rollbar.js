/**
 * @module we-js-logger/util/common/rollbar
 * @description Shared rollbar helpers
 */

// https://github.com/trentm/node-bunyan#levels
// to
// https://rollbar.com/docs/notifier/rollbar.js/api/#rollbardebuginfowarnwarningerrorcritical
const bunyanToRollbarLevelMap = {
  fatal: 'critical',
  error: 'error',
  warn: 'warning',
  info: 'info',
  debug: 'debug',
  trace: 'debug'
};

export const bunyanLevelToRollbarLevelName = (level = bunyan.ERROR) => {
  const bunyanLevelName = bunyan.nameFromLevel[level];
  return bunyanToRollbarLevelMap[bunyanLevelName] || 'error';
};
