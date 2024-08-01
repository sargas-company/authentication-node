const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

const apiKeyMiddleware = require('../src/middlewares/API/api-key.middleware');

describe('apiKeyMiddleware', () => {
  let apiKey;

  before(async function () {
    apiKey = process.env.API_KEY;
  });

  it('should call next if API key is valid', () => {
    const req = { get: () => apiKey };
    const res = {};
    const next = () => {};

    const nextSpy = chai.spy(next);

    apiKeyMiddleware(req, res, nextSpy);

    expect(nextSpy).to.have.been.called();
  });

  it('should return 401 status with error message if API key is invalid', () => {
    const req = { get: () => 'invalidApiKey' };
    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(401);
        return {
          send: (response) => {
            expect(response.message).to.equal('Invalid API key');
          },
        };
      },
    };
    const next = () => {};

    const nextSpy = chai.spy(next);

    apiKeyMiddleware(req, res, nextSpy);

    expect(nextSpy).to.not.have.been.called();
  });
});
