const chai = require('chai');
const expect = chai.expect;
const app = require('../src');
const fs = require('fs');
const request = require('supertest')(app);
const authService = require('../src/services/user.service');
const { hashPassword } = require('../src/helpers/encryption');

describe('POST /', function () {
  let apiKey;

  before(async function () {
    apiKey = process.env.API_KEY;
  });

  it('should return 400 if email or password is missing', function (done) {
    request
      .post('/auth/login')
      .set('x-api-key', apiKey)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors).to.be.an('array');
        expect(res.body.errors).to.include('Email is required');
        expect(res.body.errors).to.include('Password is required');
        done();
      });
  });

  it('should return 401 if email is not found in the database', function (done) {
    request
      .post('/auth/login')
      .set('x-api-key', apiKey)
      .send({
        email: 'notfound@example.com',
        password: 'password123',
      })
      .expect(401, { message: 'Invalid email or password' }, done);
  });

  it('should return 401 if password is incorrect', function (done) {
    request
      .post('/auth/login')
      .set('x-api-key', apiKey)
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      .expect(401, { message: 'Invalid email or password' }, done);
  });

  it('should return 200 with access and refresh tokens if login is successful', async function () {
    const hashedPassword = await hashPassword('password123');
    const testUser = await authService.create({
      email: 'test@example.com',
      password: hashedPassword,
    });

    // Make the login request with the test user's credentials
    const res = await request
      .post('/auth/login')
      .set('x-api-key', apiKey)
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);
    // Remove the test user from the database

    await authService.delete(testUser._id);
    // Assert that the response contains access and refresh tokens
    expect(res.body.accessToken).to.be.a('string');
    expect(res.body.refreshToken).to.be.a('string');
  });
});
