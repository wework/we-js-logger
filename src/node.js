'use strict';

import bunyan from 'bunyan';

import { assembleConfig, toBunyanConfig, BUNYAN_LOGGER_LEVELS } from './util/common/config';
import logForLevel from './util/common/logForLevel';

import Rollbar from 'rollbar';
import bunyanFormat from 'bunyan-format';
import ServerRollbarLogger from './util/server/rollbarLogger';
import ServerLogentriesLogger from './util/server/logentriesLogger';
import createRequestLogger from './util/server/requestLogger';

/**
 * A logger than can be used in node processes
 * @param   {Object}  config - we-js-logger config
 * @param   {Object?} logger - an instance of a `bunyan` logger to use internally.
 *                             this is meant to be used by the `child` method.
 */
export default function NodeLogger(config = {}, logger) {
  const serverConfig = assembleConfig(config, getStreams);
  logger = logger || bunyan.createLogger(toBunyanConfig(serverConfig));

  this._config = config;
  this._logger = logger;

  // Server-specific extras
  this.requestLogger = createRequestLogger(this._logger, serverConfig);
  this.rollbarErrorMiddleware = Rollbar.errorHandler(serverConfig.rollbarToken);
}

NodeLogger.prototype.child = function () {
  const childLogger = this._logger.child.apply(this._logger, arguments);
  return new NodeLogger(this._config, childLogger);
}

// Dynamically hoist + wrap bunyan log instance methods (logger.info, logger.warn, etc)
BUNYAN_LOGGER_LEVELS.forEach(level => {
  NodeLogger.prototype[level] = logForLevel(level);
});

/**
 * Add standard Node logger streams to `config.streams`
 * @private
 * @param  {Object} config
 * @param  {Array?} config.streams
 * @returns {Array}
 */
function getStreams(config) {
  const streams = Array.isArray(config.streams)
    ? [...config.streams]
    : [];

  // Nice output to stdout
  if (config.stdout) {
    streams.push({
      name: 'stdout',
      level: config.level,
      stream: bunyanFormat({ outputMode: 'short' }),
      type: 'stream'
    });
  }

  // Rollbar Transport
  // Messages at the warn level or higher are transported to Rollbar
  // Messages with an `err` and/or `req` data params are handled specially
  if (config.rollbarToken) {
    streams.push({
      name: 'rollbar',
      level: 'warn',
      stream: new ServerRollbarLogger({
        token: config.rollbarToken,
        environment: config.environment,
        codeVersion: config.codeVersion,
      }),
      type: 'raw'
    });
  }

  // Transport server logs
  if (config.logentriesToken) {
    streams.push(new ServerLogentriesLogger({
      token: config.logentriesToken,
      level: config.level
    }));
  }

  return streams;
}
