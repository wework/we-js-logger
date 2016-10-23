import bunyan from 'bunyan';

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
  rollbarToken: null
});

/**
 * Merges config with DEFAULT_CONFIG, and appends passed in streams
 * with pre-configured streams for the runtime
 *
 * @param  {Object} config
 * @param  {Function} getStreamsForRuntime - returns appended config.streams
 * @returns {Object} runtimeConfig
 */
export function assembleConfig(config, getStreamsForRuntime) {
  return Object.assign({},
    DEFAULT_CONFIG,
    config,
    {
      streams: getStreamsForRuntime(config)
    }
  );
}
