const http = require('http');
const {expect}  = require('chai');

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
		makeRequest('GET', '/', (body) => {
			expect(body).to.equal('b4getftr');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('POST', '/', (body) => {
			expect(body).to.equal('b4ftr');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a', (body) => {
			expect(body).to.equal('b41nvaftr1');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('POST', '/a', (body) => {
			expect(body).to.equal('b41postftr1');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a/b', (body) => {
			expect(body).to.equal('b42nvbftr2');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('PUT', '/a/b', (body) => {
			expect(body).to.equal('b42putftr2');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a/b/c', (body) => {
			expect(body).to.equal('b43nvcftr3');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('DELETE', '/a/b/c', (body) => {
			expect(body).to.equal('b43delftr3');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a/b/c/d', (body) => {
			expect(body).to.equal('b44getftr4');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('POST', '/a/b/c/d', (body) => {
			expect(body).to.equal('b44postftr4');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('PUT', '/a/b/c/d', (body) => {
			expect(body).to.equal('b44nvcftr4');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('GET', '/a/b/c/d/e', (body) => {
			expect(body).to.equal('getftr5');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('POST', '/a/b/c/d/e', (body) => {
			expect(body).to.equal('postftr5');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('PUT', '/a/b/c/d/e', (body) => {
			expect(body).to.equal('putftr5');
			done();
		});
	});

	it('should pass', function (done) {
		makeRequest('DELETE', '/a/b/c/d/e', (body) => {
			expect(body).to.equal('nvcftr5');
			done();
		});
	});
});
