const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Parent-chain test', function () {
	const app    = bts('./tests/app-folders/Parent');
	const server = http.createServer(app);


	beforeEach(function () {
		server.listen(8181, '127.0.0.1');
	});
	afterEach(function () {
		server.close();
	});


	it('should pass', function (done) {
		makeRequest('GET', '/a/b1', (body) => {
			expect(body).to.equal('prebpost');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a/b/c1', (body) => {
			expect(body).to.equal('prepre1cpost1post');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a/b/c/d1', (body) => {
			expect(body).to.equal('prepre1pre2dpost2post1post');
			done();
		});
	});
});
