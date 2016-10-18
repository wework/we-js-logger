we-js-logger
====================

## TODO: write out these docs!

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

[![Sauce Test Status][saucelabs-image]][saucelabs-url]

>Logger for node processes and browser applications with transports to Rollbar and Logentries

# Introduction


# Usage

```js

```

## Configuration


## Examples

```js

```


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

### Docs
Regenerate `API.md` docs from JSDoc comments
```shell
$ npm run docs
```

### Release
We're using `np` to simplify publishing to npm. We have two targets preconfigured, for others go ahead an use `np` directly.

```shell
$ npm run release:pre   # prerelease
$ npm run release:patch # patch release
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

