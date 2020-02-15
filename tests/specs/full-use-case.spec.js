const http = require('http');
const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Full use case test', function () {
	const app    = bts('./tests/app-folders/www');
	const server = http.createServer(app);


	beforeEach(function () {
		server.listen(8181, '127.0.0.1');
	});
	afterEach(function () {
		server.close();
	});


	it('should pass', function (done) {
		makeRequest('/', 'figal', done, 'get');
	});

	it('should pass', function (done) {
		makeRequest('/', 'fial', done, 'post');
	});

	it('should pass', function (done) {
		makeRequest('/bla', 'fiblaal', done, 'post');
	});

	it('should pass', function (done) {
		makeRequest('/qwe', 'fprmqweptml', done, 'put');
	});

	it('should pass', function (done) {
		makeRequest('/a', 'fprsf1i1g1a1l1ptsl', done, 'get');
	});

	it('should pass', function (done) {
		makeRequest('/a', 'fprsf1i1nva1l1ptsl', done, 'post');
	});

	it('should pass', function (done) {
		makeRequest('/a/asd', 'fprsf1prm1asdptm1l1ptsl', done);
	});

	it('should pass', function (done) {
		makeRequest('/a/asd/bla/blu', 'fprsf1prm1asdblabluptm1l1ptsl', done);
	});

	it('should pass', function (done) {
		makeRequest('/a/b', 'fprsf1prs1f2i2g2a2l2pts1l1ptsl', done, 'get');
	});

	it('should pass', function (done) {
		makeRequest('/a/b', 'fprsf1prs1f2i2nva2l2pts1l1ptsl', done, 'post');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/zxc', 'fprsf1prs1f2prm2zxcptm2l2pts1l1ptsl', done);
	});
});
