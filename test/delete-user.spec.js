const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../src'); // Ensure this points to your Express app
const { User } = require('../src/models');
const { RequestHeadersEnum } = require('../src/constants');
const authService = require('../src/services/user.service');

describe('DELETE /users', function () {
  let apiKey;
  let token;
  let user;

  before(async () => {
    apiKey = process.env.API_KEY;

    // Create a new user to delete
    const newUser = {
      username: 'userToDelete',
      email: 'userToDelete@test.com',
      password: 'password123',
      phone: '+1234567890',
      twoFactorAuth: 'optional',
    };

    await request(app)
      .post('/users/register')
      .set('x-api-key', apiKey)
      .send(newUser);

    // Authenticate the user and get a token
    const loginRes = await request(app)
      .post('/auth/login')
      .set('x-api-key', apiKey)
      .send({ email: newUser.email, password: newUser.password });

    token = loginRes.body.accessToken;
    user = await User.findOne({ email: newUser.email });
  });

  it('should delete the authenticated user', async () => {
    const res = await request(app)
      .delete('/users')
      .set(RequestHeadersEnum.AUTHENTICATION, `Bearer ${token}`)
      .set('x-api-key', apiKey);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('User deleted successfully');

    const deletedUser = await User.findOne({ email: user.email });
    expect(deletedUser).to.be.null;
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).delete('/users').set('x-api-key', apiKey);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Authorization token is missing.');
  });

  it('should return 401 if an invalid token is provided', async () => {
    const res = await request(app)
      .delete('/users')
      .set(RequestHeadersEnum.AUTHENTICATION, 'Bearer invalidToken')
      .set('x-api-key', apiKey);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Token is invalid.');
  });

  after(async () => {
    await User.findByIdAndDelete(user._id);
  });
});
