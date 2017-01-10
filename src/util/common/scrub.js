import hideSecrets from 'hide-secrets';

export default function(obj, config = {}) {
  return hideSecrets(obj, { badWords: config.scrubFields });
}
