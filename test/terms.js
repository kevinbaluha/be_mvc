//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Book = require('../app/model/terms');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Terms', () => {
/*
  * Test the /GET route
*/
  describe('/GET /terms/26681/longest-preview-media-url', () => {
      it('it should get a json response and have a 200 status', (done) => {
        chai.request(server)
            .get('/terms/26681/longest-preview-media-url')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
              done();
            });
      });
  });

  describe('/GET /', () => {
      it('it should get a 404 response', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(404);
              done();
            });
      });
  });


  describe('/GET /terms/9202/longest-preview-media-url', () => {
      it('it should get 404 response', (done) => {
        chai.request(server)
            .get('/terms/9202/longest-preview-media-url')
            .end((err, res) => {
                res.should.have.status(404);
              done();
            });
      });
  });

});
