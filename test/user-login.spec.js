const chai = require('chai');
const expect = chai.expect;
const app = require('../src');
const fs = require('fs');
const request = require('supertest')(app);
const authService = require('../src/services/user.service');

describe('POST /', function () {
  before(function () {
    // Create .test.env file
    fs.writeFileSync(
      '.test.env',
      'API_KEY=qwerty12345\nMONGO_DB_URL=mongodb+srv://root:root@cluster0.gfysmuj.mongodb.net/?retryWrites=true&w=majority\nACCESS_TOKEN_SECRET=secret\nACCESS_TOKEN_LIFETIME=1d\nREFRESH_TOKEN_SECRET=secret\nREFRESH_TOKEN_LIFETIME=10d\nADMIN_ACCESS_TOKEN_SECRET=admin_secret\nADMIN_ACCESS_TOKEN_LIFETIME=1d\nADMIN_REFRESH_TOKEN_SECRET=admin_secret_refresh\nADMIN_REFRESH_TOKEN_LIFETIME=10d\n',
    );
  });

  after(function () {
    // Remove .test.env file
    fs.unlinkSync('.test.env');
  });

  it('should return 400 if email or password is missing', function (done) {
    request
      .post('/auth/login')
      .set('x-api-key', 'qwerty12345')
      .send({})
      .expect(400, { message: 'Email and password are required' }, done);
  });

  it('should return 401 if email is not found in the database', function (done) {
    request
      .post('/auth/login')
      .set('x-api-key', 'qwerty12345')
      .send({
        email: 'notfound@example.com',
        password: 'password123',
      })
      .expect(401, { message: 'Invalid email or password' }, done);
  });

  it('should return 401 if password is incorrect', function (done) {
    request
      .post('/auth/login')
      .set('x-api-key', 'qwerty12345')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      .expect(401, { message: 'Invalid email or password' }, done);
  });

  it('should return 200 with access and refresh tokens if login is successful', async function () {
    const testUser = await authService.create({
      email: 'test@example.com',
      password: 'password123',
    });
    // Make the login request with the test user's credentials
    const res = await request
      .post('/auth/login')
      .set('x-api-key', 'qwerty12345')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);
    // Remove the test user from the database
    await authService.delete(testUser.id);
    // Assert that the response contains access and refresh tokens
    expect(res.body.accessToken).to.be.a('string');
    expect(res.body.refreshToken).to.be.a('string');
  });
});
