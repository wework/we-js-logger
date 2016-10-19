/**
 * @module we-js-logger/util/common/rollbar
 * @description Shared rollbar helpers
 */

/**
 * Maps bunyan log levels to Rollbar levels
 * https://github.com/trentm/node-bunyan#levels
 * https://rollbar.com/docs/notifier/rollbar.js/api/#rollbardebuginfowarnwarningerrorcritical
 * @type {Object}
 */
const bunyanToRollbarLevelMap = {
  fatal: 'critical',
  error: 'error',
  warn: 'warning',
  info: 'info',
  debug: 'debug',
  trace: 'debug'
};

/**
 * @param  {String} level - bunyan log level
 * @returns {String} Rollbar log level
 */
export const bunyanLevelToRollbarLevelName = (level = bunyan.ERROR) => {
  const bunyanLevelName = bunyan.nameFromLevel[level];
  return bunyanToRollbarLevelMap[bunyanLevelName] || 'error';
};
