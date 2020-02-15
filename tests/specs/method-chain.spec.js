const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Method-chain test', function () {
	const app    = bts('./tests/app-folders/Method');
	const server = http.createServer(app);


	beforeEach(function () {
		server.listen(8181, '127.0.0.1');
	});
	afterEach(function () {
		server.close();
	});


	it('should pass', function (done) {
		makeRequest('GET', '/a1', (body) => {
			expect(body).to.equal('preapost');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a/b1', (body) => {
			expect(body).to.equal('prebpost');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a/b/c1', (body) => {
			expect(body).to.equal('precpost');
			done();
		});
	});

	it('_METHOD turns a folder into a method (instead of a controller)', function (done) {
		makeRequest('GET', '/a/b/a-method', (body) => {
			expect(body).to.equal('premethodpost');
			done();
		});
	});
});
