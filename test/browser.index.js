require('./runner');

// require all `/test/specs/**/*.js`
const testsContext = require.context('./specs/', true, /\.js$/);
testsContext.keys().forEach(testsContext);