import scrub from './scrub';

/**
 * Creates a log method for a particular level
 * @param  {String} level
 * @return {Function}
 */
export default function logForLevel(level) {

  /**
   * Log at a level.
   * Must be bound to a logger instance.
   *
   * @param  {*} args
   * @return {undefined}
   */
  return function logIt(...args) {
    return this._logger[level].apply(this._logger, scrub(args, this._config, this._logger));
  }
}
