const { describe, it } = require('mocha');
const request = require('supertest');

async function generateBasicTests(app) {
  const { expect } = await import('chai');

  return `
const request = require('supertest');
const app = require('../server');

describe('API Tests', function() {
  describe('GET /', function() {
    it('should return status 200', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('Error Handling', function() {
    it('should return 404 for non-existent routes', function(done) {
      request(app)
        .get('/non-existent-route')
        .expect(404, done);
    });
  });
});
  `;
}

module.exports = {
  generateBasicTests
};