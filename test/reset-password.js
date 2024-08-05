const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const sinon = require('sinon');
const app = require('../src'); // Ensure this points to your Express app
const { User } = require('../src/models');
const { userService } = require('../src/services/');
const nodemailer = require('nodemailer');
const { RequestHeadersEnum } = require('../src/constants');

describe('POST /users/reset-password', function () {
	let user;
	let sandbox;
	let apiKey;
	let token;
	let sendMailStub;
	
	before(async () => {
		apiKey = process.env.API_KEY;
		
		// Create a new user to test password reset
		user = await userService.create({
			username: 'testuser',
			email: 'testuser@test.com',
			password: 'password123',
			phone: '+1234567890',
			twoFactorAuth: 'optional',
		});
		
		// Authenticate the user and get a token
		const loginRes = await request(app)
			.post('/auth/login')
			.set('x-api-key', apiKey)
			.send({ email: user.email, password: user.password });
		
		token = loginRes.body.accessToken;
	});
	
	beforeEach(() => {
		sandbox = sinon.createSandbox();
		// Mock nodemailer createTransport and sendMail
		const transport = {
			sendMail: sinon.stub().resolves(true)
		};
		sendMailStub = transport.sendMail;
		sandbox.stub(nodemailer, 'createTransport').returns(transport);
	});
	
	afterEach(() => {
		sandbox.restore();
	});
	
	it('should send a reset password email successfully', async () => {
		this.timeout(2000);
		const res = await request(app)
			.post('/auth/reset-password')
			.set(RequestHeadersEnum.AUTHENTICATION, `Bearer ${token}`)
			.set('x-api-key', apiKey)
			.send({ email: user.email });
		
		expect(res.status).to.equal(200);
		expect(res.body.message).to.equal('Reset password email sent successfully');
		expect(sendMailStub.calledOnce).to.be.true;
	});
	
	it('should return 400 if email is not provided', async () => {
		this.timeout(2000);
		
		const res = await request(app)
			.post('/auth/reset-password')
			.set(RequestHeadersEnum.AUTHENTICATION, `Bearer ${token}`)
			.set('x-api-key', apiKey)
			.send({});
		
		expect(res.status).to.equal(400);
		expect(res.body.message).to.equal('Email is required');
	});
	
	it('should return 404 if email does not exist', async () => {
		this.timeout(2000);
		
		const res = await request(app)
			.post('/auth/reset-password')
			.set(RequestHeadersEnum.AUTHENTICATION, `Bearer ${token}`)
			.set('x-api-key', apiKey)
			.send({ email: 'nonexistentemail@test.com' });
		
		expect(res.status).to.equal(404);
		expect(res.body.message).to.equal('User not found');
		expect(sendMailStub.called).to.be.false;
	});
	
	after(async () => {
		// Clean up the user created for testing
		await User.findByIdAndDelete(user._id);
	});
});
