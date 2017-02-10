/* eslint-disable import/prefer-default-export */

import bunyan from 'bunyan';

/**
 * Map of bunyan log levels to Rollbar levels
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
  trace: 'debug',
};

/**
 * Convert bunyan log level to rollbar level. Defaults to 'error'.
 * @param   {String} level - bunyan log level
 * @returns {String} Rollbar log level
 */
export const bunyanLevelToRollbarLevelName = (level = bunyan.ERROR) => {
  const bunyanLevelName = bunyan.nameFromLevel[level];
  return bunyanToRollbarLevelMap[bunyanLevelName] || 'error';
};
