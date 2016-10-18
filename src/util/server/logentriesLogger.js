/**
 * @module we-js-logger/util/server/logentriesLogger
 * @description Custom bunyan stream that transports to logentries from a node process
 */

import Logentries from 'le_node';

export default function ServerLogentriesLogger({ token, level }) {
  const loggerDefinition = Logentries.bunyanStream({
    token,
    secure: true,
    withStack: true
  });
  loggerDefinition.level = level;

  return loggerDefinition;
}
