/**
 * @module we-js-logger/util/client/consoleLogger
 * @description Custom bunyan stream that writes to browser console with nice formatting
 */

import bunyan from 'bunyan';

export default function ClientConsoleLogger() {}
ClientConsoleLogger.prototype.write = function (data = {}) {
  const loggerName = data.component ? `${data.name}/${data.component}` : data.name;

  let levelCss;
  const defaultCss = 'color: DimGray';
  const msgCss = 'color: SteelBlue';

  if (data.level < bunyan.DEBUG) {
    levelCss = 'color: DeepPink';
  } else if (data.level < bunyan.INFO) {
    levelCss = 'color: GoldenRod';
  } else if (data.level < bunyan.WARN) {
    levelCss = 'color: DarkTurquoise';
  } else if (data.level < bunyan.ERROR) {
    levelCss = 'color: Purple';
  } else if (data.level < bunyan.FATAL) {
    levelCss = 'color: Crimson';
  } else {
    levelCss = 'color: Black';
  }

  console.log( // eslint-disable-line no-console
    '[%s] %c%s%c: %s: %c%s',
    data.time,
    levelCss, bunyan.nameFromLevel[data.level],
    defaultCss, loggerName,
    msgCss, data.msg
  );

  if (data.err && data.err.stack) {
    console.error(data.err.stack); // eslint-disable-line no-console
  }
};
