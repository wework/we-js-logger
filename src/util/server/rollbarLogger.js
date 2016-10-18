/**
 * @module we-js-logger/util/server/rollbarLogger
 * @description Custom bunyan stream that transports to Rollbar from a node process.
 *              Note: Rollbar initialization is handled here.
 */

import Rollbar from 'rollbar';
import omit from 'lodash/omit';
import isError from 'lodash/isError';
import bunyan from 'bunyan';
import { bunyanLevelToRollbarLevelName } from '../common/rollbar';

export default function RollbarLogger({ token, codeVersion, environment }) {
  // https://rollbar.com/docs/notifier/node_rollbar/#configuration-reference
  Rollbar.init(token, {
    handleUncaughtExceptionsAndRejections: true,
    codeVersion,
    environment
  });
}

RollbarLogger.prototype.write = function (data = {}) {
  const rollbarLevelName = bunyanLevelToRollbarLevelName(data.level);
  const scopeData = omit(data, ['req', 'level']);

  if (data.err && isError(data.err)) {
    Rollbar.handleErrorWithPayloadData(data.err, {
      level: rollbarLevelName,
      ...scopeData
    }, data.req);
  } else {
    Rollbar.reportMessageWithPayloadData(data.msg, {
      level: rollbarLevelName,
      ...scopeData
    }, data.req);
  }
};
