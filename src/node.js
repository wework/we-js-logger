import Logger from './util/common/logger';

import bunyanFormat from 'bunyan-format';
import ServerRollbarLogger from './util/server/rollbarLogger';
import ServerLogentriesLogger from './util/server/logentriesLogger';
import RollbarLogger from './util/server/rollbarLogger';

/**
 * @module we-js-logger/node
 * @description A logger than can be used in node processes
 */
export default class NodeLogger extends Logger {
  getStreams() {
    // Any passed in streams
    const streams = [...this.streams];

    // Nice output to stdout
    if (this.stdout) {
      streams.push({
        level: this.level,
        stream: bunyanFormat({ outputMode: 'short' }),
        type: 'stream'
      });
    }

    // Rollbar Transport
    // Messages at the warn level or higher are transported to Rollbar
    // Messages with an `err` and/or `req` data params are handled specially
    if (this.rollbarToken) {
      streams.push({
        name: 'rollbar',
        level: 'warn',
        stream: new ServerRollbarLogger({
          token: this.rollbarToken,
          environment: this.environment,
          codeVersion: this.codeVersion
        }),
        type: 'raw'
      });
    }

    // Transport server logs
    if (this.logentriesToken) {
      streams.push(new ServerLogentriesLogger({
        token: this.logentriesToken,
        level: this.level
      }));
    }

    return streams;
  }
}