import bunyan from 'bunyan';
import { forEach } from 'lodash';

import scrub from './util/common/scrub';
import { assembleConfig, toBunyanConfig, BUNYAN_LOGGER_LEVELS } from './util/common/config';

import ClientConsoleLogger from './util/client/consoleLogger';
import ClientLogentriesLogger from './util/client/logentriesLogger';
import ClientRollbarLogger, { isGlobalRollbarConfigured } from './util/client/rollbarLogger';

/**
 * A logger than can be used in browsers
 * @param   {Object} config
 * @returns {Object} - a preconfigured `bunyan` logger instance
 */
export default function ClientLogger(config = {}) {
  const clientConfig = assembleConfig(config, getStreams);
  const logger = bunyan.createLogger(toBunyanConfig(clientConfig));

  // Attach a few extras to instances of ClientLogger
  logger.config = config;

  return logger;
}

// Extend child function to give _emit access to config in log children
const originalChild = bunyan.prototype.child;
bunyan.prototype.child = function(options, simple) {
  const childLogger = originalChild.call(this, options, simple);
  childLogger.config = this.config;
  return childLogger;
}

// Overwrite logger functions to scrub out all fields, including pre stringified msg
forEach(BUNYAN_LOGGER_LEVELS, (type) => {
  const original = bunyan.prototype[type];
  bunyan.prototype[type] = function(...args) {
    const newArgs = args.map((arg) => scrub(arg, this.config));
    return original.apply(this, newArgs);
  }
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
