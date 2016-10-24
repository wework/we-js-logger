import bunyan from 'bunyan';
import { assembleConfig, toBunyanConfig } from './util/common/config';

import Rollbar from 'rollbar';
import bunyanFormat from 'bunyan-format';
import ServerRollbarLogger from './util/server/rollbarLogger';
import ServerLogentriesLogger from './util/server/logentriesLogger';
import createRequestLogger from './util/server/requestLogger';

/**
 * A logger than can be used in node processes
 * @param   {Object} config
 * @returns {Object} - a preconfigured `bunyan` logger instance
 */
export default function NodeLogger(config = {}) {
  const serverConfig = assembleConfig(config, getStreams);
  const logger = bunyan.createLogger(toBunyanConfig(serverConfig));

  // Attach a few extras to instances of NodeLogger
  logger.requestLogger = createRequestLogger(logger, serverConfig);
  logger.rollbarErrorMiddleware = Rollbar.errorHandler(serverConfig.rollbarToken);

  return logger;
}

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
        codeVersion: config.codeVersion
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
