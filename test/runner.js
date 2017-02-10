require('babel-register');
require('babel-polyfill');

const chai = require('chai');
const sinon = require('sinon');

// NODE only
// TODO better way to guard this
// For browser tests, sinon-chai is loaded in karma config
if (typeof document === 'undefined') {
  const sinonChai = require('sinon-chai'); // eslint-disable-line global-require
  chai.use(sinonChai);
}

global.expect = chai.expect;
global.should = chai.should;
global.assert = chai.assert;
global.sinon = sinon;

// Sandbox sinon for each test
beforeEach(() => {
  global.sinon = sinon.sandbox.create();
});
afterEach(() => {
  global.sinon.restore();
});
