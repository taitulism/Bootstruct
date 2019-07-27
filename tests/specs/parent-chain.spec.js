const http = require('http');
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
		makeRequest('/a/b1', 'prebpost', done, server);
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c1', 'prepre1cpost1post', done, server);
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c/d1', 'prepre1pre2dpost2post1post', done, server);
	});
});
