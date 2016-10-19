import Logger from './util/common/logger';
import ClientConsoleLogger from './util/client/consoleLogger';
import ClientLogentriesLogger from './util/client/logentriesLogger';
import ClientRollbarLogger, { isGlobalRollbarConfigured } from './util/client/rollbarLogger';

/**
 * @module we-js-logger/client
 * @description A logger than can be used in browsers
 */
export default class ClientLogger extends Logger {
  getStreams() {
    // Any passed in streams
    const streams = [...this.streams];

    // Nice console output
    if (this.stdout) {
      streams.push({
        level: this.level,
        stream: new ClientConsoleLogger(),
        type: 'raw'
      });
    }

    // Rollbar Transport
    // Messages at the warn level or higher are transported to Rollbar
    // Detects presence of global Rollbar and passed in token
    if (isGlobalRollbarConfigured()) {
      if (this.rollbarToken) {
        streams.push({
          name: 'rollbar',
          level: 'warn',
          stream: new ClientRollbarLogger({
            token: this.rollbarToken,
            environment: this.environment,
            codeVersion: this.codeVersion
          }),
          type: 'raw'
        });
      }
    } else {
      console.warn('Client rollbar is not correctly configured');
    }

    // Transport client logs
    if (this.logentriesToken) {
      streams.push({
        name: 'logentries',
        level: this.level,
        stream: new ClientLogentriesLogger({ token: this.logentriesToken }),
        type: 'raw'
      });
    }

    return streams;
  }
}