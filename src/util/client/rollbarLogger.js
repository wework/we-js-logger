import Rollbar from 'rollbar';
import bunyan from 'bunyan';
import omit from 'lodash/omit';
import get from 'lodash/get';
import { bunyanLevelToRollbarLevelName } from '../common/rollbar';

// An unconfigured Rollbar has an accessToken of "undefined" by default
const isGlobalRollbarConfigured = () => _.get(global.Rollbar, 'options.accessToken', 'undefined') !== 'undefined';

/**
 * Custom rollbar stream that transports to logentries from a browser
 * Includes logic for handling global Rollbar instance, else initializing Rollbar here.
 * See https://rollbar.com/docs/notifier/rollbar.js/#quick-start for details on
 * integrating Rollbar in client apps
 *
 * @param {String} options.token
 * @param {String} options.environment
 * @param {String} options.codeVersion
 */
export default function RollbarLogger({ token, environment, codeVersion }) {
  if (global.Rollbar && isGlobalRollbarConfigured()) {
    // Rollbar is loaded globally (ie, the quick-start snippet has been pasted into the document's head)
  } else {
    // Init Rollbar here
    Rollbar.init({
      accessToken: token,
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        environment,
        javascipt: {
          code_version: codeVersion,
          source_map_enabled: true
        }
      }
    });
  }
}

/**
 * Transport logs to Rollbar
 * @param  {Object} data
 * @returns {undefined}
 */
RollbarLogger.prototype.write = function (data = {}) {
  const rollbarLevelName = bunyanLevelToRollbarLevelName(data.level);
  const scopeData = omit(data, ['req', 'level']);

  // https://rollbar.com/docs/notifier/rollbar.js/#usage
  Rollbar.scope(scopeData)[rollbarLevelName](data.msg, data.err);
};
