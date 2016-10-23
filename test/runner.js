require('babel-register');
require('babel-polyfill');

const chai = require('chai');
const sinon = require('sinon');

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
