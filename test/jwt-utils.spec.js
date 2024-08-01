const chai = require('chai');
const expect = chai.expect;

const { jwtTokenGen, jwtTokenVerify } = require('../src/helpers/jwt-utils');

const sleep = async (milliseconds) => {
  await new Promise((resolve) => {
    return setTimeout(resolve, milliseconds);
  });
};

describe('jwtUtils', () => {
  it('should generate a valid JWT token with userid 123.', () => {
    const payload = { userId: '123' };
    const token = jwtTokenGen(payload, 'secret', '10m');
    expect(token).to.be.a('string');
  });

  it('should verify a valid JWT token and userid is same to 123.', async function () {
    const payload = { userId: '123' };
    const token = jwtTokenGen(payload, 'secret', '10m');
    const decodedData = jwtTokenVerify(token, 'secret');
    expect(decodedData.userId).to.equal('123');
  });

  it('should output jwt expired message.', async function () {
    const payload = { userId: '123' };
    const token = jwtTokenGen(payload, 'secret', '1s');

    await sleep(1100);
    try {
      const decodedData = jwtTokenVerify(token, 'secret');
    } catch (error) {
      expect(error.msg).to.equal('jwt expired');
    }
  });
});
