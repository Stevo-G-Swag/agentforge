const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server.cjs');

function generateBasicTests() {
  return `
describe('GET /', function() {
  it('should return status 200', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});
  `;
}

module.exports = {
  generateBasicTests
};