/**
 * @module we-js-logger/util/client/logentriesLogger
 * @description Custom bunyan stream that transports to logentries from a browser
 */

import isFunction from 'lodash/isFunction';
import bunyan from 'bunyan';
import LE from 'le_js';

export default function ClientLogentriesLogger({ token }) {
  LE.init({
    token,
    no_format: true,
    page_info: 'per-page'
  });
}

ClientLogentriesLogger.prototype.write = function (data = {}) {
  const level = bunyan.nameFromLevel[data.level];
  if (isFunction(LE[level])) {
    LE[level](data);
  } else {
    LE.log(data);
  }
};
