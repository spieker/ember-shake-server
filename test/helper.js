global.chai   = require('chai');
global.expect = chai.expect;
global.Sinon  = require('sinon');

chai.use(require('sinon-chai'));

// Set up a Sinon Sandbox for each test
beforeEach(function() {
  global.sinon = Sinon.sandbox.create()
});

afterEach(function() {
  sinon.restore();
});
