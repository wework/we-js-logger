import Rollbar from 'rollbar';
import omit from 'lodash/omit';
import isError from 'lodash/isError';
import { bunyanLevelToRollbarLevelName } from '../common/rollbar';

/**
 * Custom bunyan stream that transports to Rollbar from a node process.
 * See https://rollbar.com/docs/notifier/node_rollbar/ for integration details
 */
export default function ServerRollbarLogger({ token, codeVersion, environment }) {
  // https://rollbar.com/docs/notifier/node_rollbar/#configuration-reference
  Rollbar.init(token, {
    handleUncaughtExceptionsAndRejections: true,
    codeVersion,
    environment,
  });
}

/**
 * Transport to Rollbar
 * @description handles `err` and `req` properties, attaches any custom data,
 * and calls the appropriate Rollbar method.
 *
 * @param  {Object} data
 * @returns {undefined}
 */
ServerRollbarLogger.prototype.write = function (data = {}) {
  const rollbarLevelName = bunyanLevelToRollbarLevelName(data.level);
  const scopeData = omit(data, ['req', 'level']);
  const payload = Object.assign({ level: rollbarLevelName }, scopeData);

  if (data.err && isError(data.err)) {
    Rollbar.handleErrorWithPayloadData(data.err, payload, data.req);
  } else {
    Rollbar.reportMessageWithPayloadData(data.msg, payload, data.req);
  }
};
