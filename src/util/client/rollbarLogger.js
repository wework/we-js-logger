import omit from 'lodash/omit';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';

import { bunyanLevelToRollbarLevelName } from '../common/rollbar';

// Rollbar script exposes this global immediately, whether or not its already initialized
export const isGlobalRollbarConfigured = () => !!get(global, 'Rollbar');

/**
 * Custom rollbar stream that transports to logentries from a browser
 * Wortks with a global Rollbar instance that is already initialized.
 * Note this expects rollbar to be loaded in the head, not via an npm module.
 * See https://rollbar.com/docs/notifier/rollbar.js/#quick-start for details on
 * integrating Rollbar in client apps
 *
 * @param {String} options.token
 * @param {String} options.environment
 * @param {String} options.codeVersion
 */
export default function ClientRollbarLogger({ token, environment, codeVersion }) {
  // Rollbar may already be initialized, but thats ok
  // https://rollbar.com/docs/notifier/rollbar.js/configuration/
  global.Rollbar.configure({
    accessToken: token,
    environment,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment,
      javascript: {
        code_version: codeVersion,
        source_map_enabled: true,
      },
    },
  });
}

/**
 * Transport logs to Rollbar
 * @param  {Object} data
 * @returns {undefined}
 */
ClientRollbarLogger.prototype.write = function (data = {}) {
  const rollbarLevelName = bunyanLevelToRollbarLevelName(data.level);
  const scopeData = omit(data, ['err', 'level']);
  const payload = Object.assign({ level: rollbarLevelName }, scopeData);

  // https://rollbar.com/docs/notifier/rollbar.js/#rollbarlog
  const logFn = global.Rollbar[rollbarLevelName];
  if (isFunction(logFn)) {
    logFn.call(global.Rollbar, data.msg, data.err, payload);
  } else {
    global.Rollbar.error(data.msg, data.err, payload);
  }
};
