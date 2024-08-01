const chai = require('chai');
const expect = chai.expect;

const { generateToken, verifyToken } = require('../src/helpers');
const { ACCESS_TOKEN_SECRET } = require("../src/config/constants");
const {RoleEnum, ActionEnum} = require("../src/constants");

const sleep = async (milliseconds) => {
  await new Promise((resolve) => {
    return setTimeout(resolve, milliseconds);
  });
};

describe('jwtUtils', () => {
  it('should generate a valid JWT token with userid 123.', async () => {
    const user = { userId: '123', role: RoleEnum.USER };
    const action = ActionEnum.LOGIN;
    const token = await generateToken({ user, action });

    expect(token.accessToken).to.be.a('string');
    expect(token.refreshToken).to.be.a('string');
  });
  
  it('should verify a valid JWT token and userid is same to 123.', async () => {
    const user = { id: '123', role: RoleEnum.USER };
    const action = ActionEnum.LOGIN;
    const { accessToken } = await generateToken({ user, action });
    const decodedData = await verifyToken(ActionEnum.USER_ACCESS,accessToken);
    expect(decodedData.userId).to.equal('123');
  });
  
  it('should output jwt expired message.', async  () => {
    const user = { id: '123', role: RoleEnum.USER };
    const action = ActionEnum.LOGIN;
    const { accessToken } = generateToken({ user, action });
    await sleep(1100);
    try {
      await verifyToken(accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {
      expect(error.message).to.equal('jwt expired');
    }
  });
});
