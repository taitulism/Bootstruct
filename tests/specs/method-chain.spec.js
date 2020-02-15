const http = require('http');
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
		makeRequest('/a1', 'preapost', done);
	});

	it('should pass', function (done) {
		makeRequest('/a/b1', 'prebpost', done);
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c1', 'precpost', done);
	});

	it('_METHOD turns a folder into a method (instead of a controller)', function (done) {
		makeRequest('/a/b/a-method', 'premethodpost', done);
	});
});
