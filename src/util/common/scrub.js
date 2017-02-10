import isObject from 'lodash/isObject';
import tail from 'lodash/tail';
import mapValues from 'lodash/mapValues';
import hideSecrets from 'hide-secrets';

function getScrubConfig(config) {
  return { badWords: config.scrubFields };
}

function handleContext(data, config = {}, logger) {
  const serializedFields = Object.keys(logger.serializers || {});

  return mapValues(data, (val, key) => {
    if (serializedFields.includes(key)) {
      return val;
    }

    return hideSecrets(val, getScrubConfig(config));
  });
}

export default function scrub(args, config = {}, logger) {
  if (Array.isArray(config.scrubFields) && config.scrubFields.length) {
    if (isObject(args[0])) {
      return [handleContext(args[0], config, logger), ...hideSecrets(tail(args), getScrubConfig(config))];
    }

    return hideSecrets(args, getScrubConfig(config));
  }

  return args;
}
