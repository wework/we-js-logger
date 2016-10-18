/**
 * @module we-js-logger/util/client/rollbarLogger
 * @description Custom rollbar stream that transports to logentries from a browser
 *              Note: Rollbar init is *not* currently handled here, see
 *              https://rollbar.com/docs/notifier/rollbar.js/#quick-start
 *              for details on setting up Rollbar for a client app
 */

import Rollbar from 'rollbar';
import bunyan from 'bunyan';
import omit from 'lodash/omit';
import { bunyanLevelToRollbarLevelName } from '../common/rollbar';

export default function RollbarLogger({ token, environment, codeVersion }) {
  // TODO test for rollbar in head via `global.Rollbar`,
  // if present update config, else init
}

RollbarLogger.prototype.write = function (data = {}) {
  const rollbarLevelName = bunyanLevelToRollbarLevelName(data.level);
  const scopeData = omit(data, ['req', 'level']);

  // https://rollbar.com/docs/notifier/rollbar.js/#usage
  Rollbar.scope(scopeData)[rollbarLevelName](data.msg, data.err);
};
