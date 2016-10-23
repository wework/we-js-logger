we-js-logger
====================

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

[![Sauce Test Status][saucelabs-image]][saucelabs-url]

>Logger for node processes and browser applications with transports to Rollbar and Logentries

# Introduction

This is an opinionated logger for JS applications:

- Uses [bunyan](https://github.com/trentm/node-bunyan), a JSON logger, under the hood
- Transports logs to Logentries and/or Rollbar
- Universal. Can be used in the browser and Node.js processes

# Usage

```js
import Logger from 'we-js-logger';
const log = new Logger({
    name: 'my-logger',
    environment: 'production',
    level: 'debug',
    codeVersion: process.env.SHA_VERSION,
    logentriesToken: process.env.LOGENTRIES_TOKEN,
    rollbarToken: process.env.ROLLBAR_TOKEN
});
```

## Node.js usage

This package can be used via `npm` and `node` with no special considerations.

## Browser usage

This package exposes a `client` build for browser usage. It is referenced in the `browser` field of `package.json`, so module loaders that follow this spec will load it easily.

For example, we commonly use `webpack` to load this module.

### Webpack Considerations

*TODO document webpack setup*

## Configuration

See https://github.com/wework/we-js-logger/blob/master/API.md#we-js-loggerutillogger for API documentation

## Examples

```js
log.fatal({ err }, 'Application crashing because something terrible happened.');

log.error({ err, req }, 'API request failed');

log.info({ action }, 'Something relevant happened')

log.debug({ event, action }, 'Something useful for developers happened');

```

See https://github.com/trentm/node-bunyan#log-method-api for more detail.

# Logentries Integration

*More docs coming soon.*

Providing the `Logger` constructor a `logentriesToken` option enables this transport.

# Rollbar Integration

## Node
For node usage, this library will initialize Rollbar.

See https://rollbar.com/docs/notifier/node_rollbar/ for documentation on setting up Rollbar for node processes.

## Browser
For browser usage, this library expects Rollbar to be loaded via their quick-start script tag. This also allows Rollbar to capture any errors before the logger's initialization code, if that's important to you.

See https://rollbar.com/docs/notifier/rollbar.js/#quick-start for documentation on setting up Rollbar for browser applications

# Development

In lieu of a formal style guide, please ensure PRs follow the conventions present, and have been properly linted and tested. Feel free to open issues to discuss.

Be aware this module is tested in both browser and node runtimes.

## Available tasks

### Build and test
Runs all tests, static analysis, and bundle for distribution
```shell
$ npm start
```

### Test
Runs browser and node tests
```shell
$ npm test
```

Runs browser tests via PhantomJS only
```shell
$ npm run test:browser
```

Runs browser tests via SauceLabs only
```shell
$ SAUCELABS=true npm run test:browser
```

Runs node tests only
```shell
$ npm run test:node
```

### TDD
Runs browser and node tests in watch mode, re-bundles on src file change
```shell
$ npm run tdd
```

### Docs
Regenerate `API.md` docs from JSDoc comments
```shell
$ npm run docs
```

### Bundle
Packages client and node bundles for distribution, output to `/dist`
```shell
$ npm run bundle
```

### Distribute
Lints, cleans, bundles, and generates docs for distribution, output to `/dist`
```shell
$ npm run dist
```

### Release
We're using `np` to simplify publishing to git + npm. A changelog and docs are generated as part of this script.

```shell
$ npm run release <semver level/version>
$ npm run release patch # patch release
$ npm run release 100.10.1 # release specific version
```



[npm-url]: https://npmjs.org/package/we-js-logger
[npm-version-image]: http://img.shields.io/npm/v/we-js-logger.svg?style=flat-square
[npm-downloads-image]: http://img.shields.io/npm/dm/we-js-logger.svg?style=flat-square

[coveralls-image]:https://coveralls.io/repos/github/wework/we-js-logger/badge.svg?branch=master
[coveralls-url]:https://coveralls.io/github/wework/we-js-logger?branch=master

[travis-url]:https://travis-ci.org/wework/we-js-logger
[travis-image]: https://travis-ci.org/wework/we-js-logger.svg?branch=master

[saucelabs-image]:https://saucelabs.com/browser-matrix/we-js-logger.svg
[saucelabs-url]:https://saucelabs.com/u/we-js-logger

[license-url]: LICENSE
[license-image]: http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square

