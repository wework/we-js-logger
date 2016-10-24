import bunyan from 'bunyan';
import pick from 'lodash/pick';

/**
 * Config keys that should always be passed to
 * `bunyan.createLogger`
 * @type {Array}
 */
const BUNYAN_CONFIG_FIELDS = [
  'name',
  'level',
  'streams',
  'serializers',
];

/**
 * Whitelist of extra config keys that should be
 * passed to `bunyan.createLogger` to form
 * root logger fields.
 * @type {Array}
 */
const DEFAULT_ROOT_FIELDS = [
  'environment',
  'release',
];

/** @type {Object} default config to Logger classes */
export const DEFAULT_CONFIG = Object.freeze({
  name: 'WeWork',
  environment: null,
  codeVersion: null,
  level: 'info',
  stdout: true,
  streams: null,
  serializers: bunyan.stdSerializers,
  logentriesToken: null,
  rollbarToken: null,
  rootFields: DEFAULT_ROOT_FIELDS
});

/**
 * Merges config with DEFAULT_CONFIG, and appends passed in streams
 * with pre-configured streams for the runtime.
 *
 * This is used to configure this library, not bunyan as it has a lot of
 * extra information. See `toBunyanConfig` below.
 *
 * @param  {Object} config
 * @param  {Function} getStreamsForRuntime - returns appended config.streams
 * @returns {Object} runtimeConfig
 */
export function assembleConfig(config, getStreamsForRuntime) {
  const baseConfig = Object.assign({}, DEFAULT_CONFIG, config);

  // Add our custom streams and return a full `we-js-logger` config object
  return Object.assign(baseConfig, {
    streams: getStreamsForRuntime(baseConfig)
  });
}

/**
 * Create a config objct for bunyan from a full `we-js-logger` config object.
 * Extra keys passed to `bunyan.createLogger` become root logger fields, pass
 * a custom `config.rootFields` to control this behavior
 *
 * @param  {Object} config
 * @param  {String[]} config.rootFields - extra fields to pass to bunyan
 * @return {Object} config for bunyan.createLogger
 */
export function toBunyanConfig(config) {
  return pick(config, BUNYAN_CONFIG_FIELDS.concat(config.rootFields));
}
