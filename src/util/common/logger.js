import bunyan from 'bunyan';

/**
 * @module we-js-logger/util/logger
 * @description Base logger class, used for both node and client loggers
 *
 * Uses [bunyan](https://github.com/trentm/node-bunyan/) under the hood, which has a few quirks
 */
export default class Logger {
  /**
   * @param  {Object}  options - logger configuration
   * @param  {String}  options.name - the name of the logger
   * @param  {String}  options.environment - application environment
   * @param  {String}  options.codeVersion - a code version, preferably a SHA
   * @param  {String}  options.level - the level to log at
   * @param  {Boolean} options.stdout - output to stdout
   * @param  {Array}   options.streams - bunyan stream configuration
   * @param  {Object}  options.serializers - bunyan serializer configuration
   * @param  {String}  options.logentriesToken - Logentries API token
   * @param  {String}  options.rollbarToken - Rollbar token
   * @returns {Object} a configured bunyan instance
   */
  constructor({
    name = 'WeWork',
    environment,
    codeVersion,
    level = 'info',
    stdout = true,
    streams = [],
    serializers = bunyan.stdSerializers,
    logentriesToken = '',
    rollbarToken = ''
  } = {}) {
    this.environment = environment;
    this.codeVersion = codeVersion;
    this.stdout = stdout;
    this.streams = streams;
    this.logentriesToken = logentriesToken;
    this.rollbarToken = rollbarToken;

    const logger = bunyan.createLogger({
      name,
      level,
      serializers,
      streams: this.getStreams()
    });

    if (!this.logentriesToken) {
      logger.trace('Logger missing logentries token');
    }

    if (!this.rollbarToken) {
      logger.trace('Logger missing rollbar token');
    }

    return logger;
  }

  /**
   * getStreams
   * @description returns bunyan streams -- meant to be overridden by subclasses of Logger
   * @returns {Array}
   */
  getStreams() {
    return this.streams;
  }
}