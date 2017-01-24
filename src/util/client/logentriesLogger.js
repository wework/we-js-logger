import isFunction from 'lodash/isFunction';
import bunyan from 'bunyan';
import LE from 'le_js';

/**
* Custom bunyan stream that transports to Logentries from client applications
* @param {String} options.token
* @param {String} options.level
*/
export default function ClientLogentriesLogger({ name, token }) {
  try {
    // If a LE logger does not exist with this name, this will throw
    LE.to(name);
  } catch (err) {
    // Init the LE logger
    LE.init({
      name,
      token,
      no_format: true,
      page_info: 'per-page'
    });
  }
}

/**
* Transport logs to Logentries
* @param  {Object} data
* @returns {undefined}
*/
ClientLogentriesLogger.prototype.write = function (data = {}) {
  const level = bunyan.nameFromLevel[data.level];
  if (isFunction(LE[level])) {
    LE[level](data);
  } else {
    LE.log(data);
  }
};
