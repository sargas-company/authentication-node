const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('auth controller', () => {
  describe('POST /api/auth/login', () => {
    it('should successfully validated in email and password', (done) => {
      const loginItem = {
        email: 'test@gmail.com',
        password: '123123vfvffhg',
      };
      chai
        .request(app)
        .post('/api/auth/login')
        .send(loginItem)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Successfully validated');
          done();
        });
    });
    it('should return an error if the email is invalid', (done) => {
      const invalidItem = {
        email: 'test@gm', // invalid email
        password: '123123vfvffhg',
      };
      chai
        .request(app)
        .post('/api/auth/login')
        .send(invalidItem)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Invalid');
          expect(res.body.data[0].msg).to.equal('Please enter valid email.');
          done();
        });
    });
    it('should ask for password length to be long', (done) => {
      const invalidItem = {
        email: 'test@gmail.com',
        password: '123123', // length is shorter than 8
      };
      chai
        .request(app)
        .post('/api/auth/login')
        .send(invalidItem)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Invalid');
          expect(res.body.data[0].msg).to.equal(
            'password minimum length should be 8 charachter long.',
          );
          done();
        });
    });
    it('should ask for password to involve at least one letter and one password', (done) => {
      const invalidItem = {
        email: 'test@gmail.com',
        password: '123123123123', // length is shorter than 8
      };
      chai
        .request(app)
        .post('/api/auth/login')
        .send(invalidItem)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Invalid');
          expect(res.body.data[0].msg).to.equal(
            'To protect your account, your password needs to be between 8 and 30 characters long and contain at least one letter and one number.',
          );
          done();
        });
    });
  });
});
