const chai = require('chai');
const expect = chai.expect;

const { hashing} = require('../src/helpers');

describe('Hashing password', function () {
  let hashedResult;
  let verifyResult;
  it('verifying hashed password success if you input right password', async function () {
    const password = 'Mypassword123';
    const rightPassword = 'Mypassword123';
    hashedResult = await hashing.hashPassword(password);
    verifyResult = await hashing.verifyPassword(rightPassword, hashedResult);
    expect(hashedResult).to.be.a('string');
    expect(verifyResult).equal(true);
  });
  it('verifying hashed password fail if you input wrong password', async function () {
    const password = 'Mypassword123';
    const wrongPassword = 'wrongpwd';
    hashedResult = await hashing.hashPassword(password, 10);
    verifyResult = await hashing.verifyPassword(wrongPassword, hashedResult);
    expect(verifyResult).equal(false);
  });
});
