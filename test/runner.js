require('babel-register');
require('babel-polyfill');

const chai = require('chai');
const sinon = require('sinon');

global.expect = chai.expect;
global.should = chai.should;
global.assert = chai.assert;
global.sinon = sinon;
