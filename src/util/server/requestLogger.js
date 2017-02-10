const uuid = require('uuid');

const DEFAULT_HEADER_NAME = 'x-request-id';

/**
 * Create a request loging express middleware
 * @param  {Object}  logger - a logger instance
 * @param  {Object}  options
 * @param  {String?} options.reqIdHeader
 * @returns {Function}
 */
export default function createRequestLogger(logger, { reqIdHeader = DEFAULT_HEADER_NAME } = {}) {

  /**
   * Request Logger Middleware
   * Adds base logging to every request
   * Attaches a `log` child to each request object
   *
   * @param  {Object}   req
   * @param  {Object}   res
   * @param  {Function} next
   * @returns {undefined}
   */
  return function requestLoggerMiddleware(req, res, next) {
    const id = req.get(reqIdHeader) || uuid.v4();
    let log = logger.child({ component: 'request', req_id: id, req });

    // attach a logger to each request
    req.log = log; // eslint-disable-line no-param-reassign

    res.setHeader(reqIdHeader, id);

    log.info('start request');

    const time = process.hrtime();
    res.on('finish', () => {
      const diff = process.hrtime(time);
      const duration = diff[0] * 1e3 + diff[1] * 1e-6; // eslint-disable-line no-mixed-operators
      log.info({ res, duration }, 'end request');

      // Release the request logger for GC
      req.log = null; // eslint-disable-line no-param-reassign
      log = null;
    });

    next();
  };
}
