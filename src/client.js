'use strict';

import bunyan from 'bunyan';

import logForLevel from './util/common/logForLevel';
import { assembleConfig, toBunyanConfig, BUNYAN_LOGGER_LEVELS } from './util/common/config';

import ClientConsoleLogger from './util/client/consoleLogger';
import ClientLogentriesLogger from './util/client/logentriesLogger';
import ClientRollbarLogger, { isGlobalRollbarConfigured } from './util/client/rollbarLogger';

/**
 * A logger than can be used in browsers
 * @param   {Object}  config - we-js-logger config
 * @param   {Object?} logger - an instance of a `bunyan` logger to use internally.
 *                             this is meant to be used by the `child` method.
 */
export default function ClientLogger(config = {}, logger) {
  const clientConfig = assembleConfig(config, getStreams);
  logger = logger || bunyan.createLogger(toBunyanConfig(clientConfig));

  this._config = config;
  this._logger = logger;
}

ClientLogger.prototype.child = function () {
  const childLogger = this._logger.child.apply(this._logger, arguments);
  return new ClientLogger(this._config, childLogger);
}

// Dynamically hoist + wrap bunyan log instance methods (logger.info, logger.warn, etc)
BUNYAN_LOGGER_LEVELS.forEach(level => {
  ClientLogger.prototype[level] = logForLevel(level);
});


/**
 * Add standard Client logger streams to `config.streams`
 * @private
 * @param  {Object} config
 * @param  {Array?} config.streams
 * @returns {Array}
 */
function getStreams(config) {
  // Any passed in streams
  const streams = Array.isArray(config.streams)
    ? [...config.streams]
    : [];

  // Nice console output
  if (config.stdout) {
    streams.push({
      name: 'stdout',
      level: config.level,
      stream: new ClientConsoleLogger(),
      type: 'raw'
    });
  }

  // Rollbar Transport
  // Messages at the warn level or higher are transported to Rollbar
  // Detects presence of global Rollbar and passed in token
  if (isGlobalRollbarConfigured()) {
    if (config.rollbarToken) {
      streams.push({
        name: 'rollbar',
        level: 'warn',
        stream: new ClientRollbarLogger({
          token: config.rollbarToken,
          environment: config.environment,
          codeVersion: config.codeVersion,
        }),
        type: 'raw'
      });
    }
  } else {
    /* eslint-disable no-console */
    console.warn('Client rollbar is not correctly configured');
    /* eslint-enable */
  }

  // Transport client logs
  if (config.logentriesToken) {
    streams.push({
      name: 'logentries',
      level: config.level,
      stream: new ClientLogentriesLogger({ token: config.logentriesToken }),
      type: 'raw'
    });
  }

  return streams;
}
