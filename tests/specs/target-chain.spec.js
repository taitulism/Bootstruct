const http = require('http');
const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Target-chain test', function () {
	const app    = bts('./tests/app-folders/Target');
	const server = http.createServer(app);

	beforeEach(function () {
		server.listen(8181, '127.0.0.1');
	});
	afterEach(function () {
		server.close();
	});

	it('should pass', function (done) {
		makeRequest('/', 'b4getftr', done, 'get');
	});

	it('should pass', function (done) {
		makeRequest('/', 'b4ftr', done, 'post');
	});

	it('should pass', function (done) {
		makeRequest('/a', 'b41nvaftr1', done, 'get');
	});

	it('should pass', function (done) {
		makeRequest('/a', 'b41postftr1', done, 'post');
	});

	it('should pass', function (done) {
		makeRequest('/a/b', 'b42nvbftr2', done, 'get');
	});

	it('should pass', function (done) {
		makeRequest('/a/b', 'b42putftr2', done, 'put');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c', 'b43nvcftr3', done, 'get');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c', 'b43delftr3', done, 'delete');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c/d', 'b44getftr4', done, 'get');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c/d', 'b44postftr4', done, 'post');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c/d', 'b44nvcftr4', done, 'put');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c/d/e', 'getftr5', done, 'get');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c/d/e', 'postftr5', done, 'post');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c/d/e', 'putftr5', done, 'put');
	});

	it('should pass', function (done) {
		makeRequest('/a/b/c/d/e', 'nvcftr5', done, 'delete');
	});
});
