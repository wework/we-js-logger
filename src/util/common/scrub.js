import hideSecrets from 'hide-secrets';

export default function scrub(args, config = {}) {
  if (Array.isArray(config.scrubFields) && config.scrubFields.length) {
    return hideSecrets(args, { badWords: config.scrubFields });
  }

  return args;
}
