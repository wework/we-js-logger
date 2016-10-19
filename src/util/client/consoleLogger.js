import bunyan from 'bunyan';

/**
 * Pretty logging to `console` for client applications
 */
export default function ClientConsoleLogger() {}

/**
 * Transport to `console`
 * @param  {Object} data
 * @returns {undefined}
 */
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
