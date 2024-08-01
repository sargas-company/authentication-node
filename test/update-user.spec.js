const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../src');
const { User } = require('../src/models');
const { RequestHeadersEnum } = require('../src/constants');

describe('User update route', () => {
  let user;
  let token;
  let apiKey;

  before(async () => {
    apiKey = process.env.API_KEY;

    // Create a new user to update
    const newUser = {
      username: 'newuser',
      email: 'newuser@test.com',
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

  it('should update the user', async () => {
    const updatedUserData = {
      username: 'updateduser',
    };

    const res = await request(app)
      .patch('/users')
      .set(RequestHeadersEnum.AUTHENTICATION, `Bearer ${token}`)
      .set('x-api-key', apiKey)
      .send(updatedUserData);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('User updated successfully');
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.username).to.equal(updatedUserData.username);
  });

  it('should return 401 error when no token is provided', async () => {
    const updatedUserData = {
      username: 'updateduser',
    };

    const res = await request(app)
      .patch('/users')
      .set('x-api-key', apiKey)
      .send(updatedUserData);

    expect(res.status).to.equal(401);
  });

  it('should return 401 error when an invalid token is provided', async () => {
    const updatedUserData = {
      username: 'updateduser',
    };

    const res = await request(app)
      .patch('/users')
      .set(RequestHeadersEnum.AUTHENTICATION, `Bearer invalidToken`)
      .set('x-api-key', apiKey)
      .send(updatedUserData);

    expect(res.status).to.equal(401);
  });

  it('should return 400 if request body is empty', async () => {
    const res = await request(app)
      .patch('/users')
      .set(RequestHeadersEnum.AUTHENTICATION, `Bearer ${token}`)
      .set('x-api-key', apiKey)
      .send({});

    expect(res.status).to.equal(400);
  });

  it('should return 400 if request body is invalid', async () => {
    const res = await request(app)
      .patch('/users')
      .set(RequestHeadersEnum.AUTHENTICATION, `Bearer ${token}`)
      .set('x-api-key', apiKey)
      .send({
        password: 'qwe',
      });

    expect(res.status).to.equal(400);
  });

  after(async () => {
    await User.findByIdAndDelete(user._id);
  });
});
