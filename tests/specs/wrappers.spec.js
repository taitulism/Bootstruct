const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Wrappers test', function () {
	const app    = bts('./tests/app-folders/Wrappers');
	const server = http.createServer(app);


	beforeEach(function () {
		server.listen(8181, '127.0.0.1');
	});
	afterEach(function () {
		server.close();
	});


	it('should pass', function (done) {
		makeRequest('GET', '/', (body) => {
			expect(body).to.equal('fl');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a', (body) => {
			expect(body).to.equal('ff1l1l');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a/b', (body) => {
			expect(body).to.equal('ff1f2l2l1l');
			done();
		});
	});
});
