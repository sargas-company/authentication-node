const chai = require('chai');
const expect = chai.expect;

const {
  encryptPassword,
  verifyPassword,
} = require('../src/helpers/encryption');

describe('Hashing password', function () {
  it('verifying hashed password success if you input right password', async function () {
    const password = 'Mypassword123';
    const rightPassword = 'Mypassword123';
    hashedResult = await encryptPassword(password);
    verifyResult = await verifyPassword(rightPassword, hashedResult);
    expect(hashedResult).to.be.a('string');
    expect(verifyResult).equal(true);
  });
  it('verifying hashed password fail if you input wrong password', async function () {
    const password = 'Mypassword123';
    const wrongPassword = 'wrongpwd';
    hashedResult = await encryptPassword(password, 10);
    verifyResult = await verifyPassword(wrongPassword, hashedResult);
    expect(verifyResult).equal(false);
  });
});
