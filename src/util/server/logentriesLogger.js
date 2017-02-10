import Logentries from 'le_node';

/**
 * Custom bunyan stream that transports to logentries from a node process
 * @param {Object} options
 * @param {String} options.token
 * @param {String} options.level
 * @returns {Object} - bunyan stream config
 */
export default function ServerLogentriesLogger({ name, token, level }) {
  const loggerDefinition = Logentries.bunyanStream({
    name,
    token,
    secure: true,
    withStack: true,
  });
  loggerDefinition.level = level;

  return loggerDefinition;
}
