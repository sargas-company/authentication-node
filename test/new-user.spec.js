const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../src');
const authService = require('../src/services/user.service');

describe('User Routes', function() {
  describe('POST /users/register', () => {
    let apiKey;
    
    before(async function() {
      apiKey = process.env.API_KEY;
    });
    
    it('should return 201 status and success message when user is created', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'password123',
        phone: '+1234567890',
        twoFactorAuth: 'optional',
      };
      const res = await request(app)
        .post('/users/register')
        .set('x-api-key', apiKey)
        .send(newUser);
      
      const newUserFromDB = await authService.findOneByParam({
        email: newUser.email,
      });
      
      await authService.delete(newUserFromDB._id);
      
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('User created successfully');
    });

    it('should return 400 status and error message when invalid user data is provided', async () => {
      const invalidUser = {
        username: 'u',
        email: 'invalidemail',
        password: 'p',
        phone: '123',
        twoFactorAuth: 'not valid',
      };
      const res = await request(app)
        .post('/users/register')
        .set('x-api-key', apiKey)
        .send(invalidUser);

      expect(res.status).to.equal(400);
      expect(res.body.message).not.null;
    });

    it('should return 409 status and error message when user with provided email already exists', async () => {
      const existingUser = {
        username: 'existinguser',
        email: 'existinguser@test.com',
        password: 'password123',
        phone: '+1234567890',
        twoFactorAuth: 'optional',
      };
      const existingUserFromDb = await authService.create(existingUser);

      const res = await request(app)
        .post('/users/register')
        .set('x-api-key', apiKey)
        .send(existingUser);

      await authService.delete(existingUserFromDb.id);
      await authService.delete(res.body.id);

      expect(res.status).to.equal(409);
      expect(res.body.message).to.equal('User already exists');
    });
  });
});
