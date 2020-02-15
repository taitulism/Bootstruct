const http = require('http');
const {expect}  = require('chai');

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


	it('should pass', (done) => {
		makeRequest('GET', '/', (body) => {
			expect(body).to.equal('figal');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('POST', '/', (body) => {
			expect(body).to.equal('fial');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('POST', '/bla', (body) => {
			expect(body).to.equal('fiblaal');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('PUT', '/qwe', (body) => {
			expect(body).to.equal('fprmqweptml');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('GET', '/a', (body) => {
			expect(body).to.equal('fprsf1i1g1a1l1ptsl');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('POST', '/a', (body) => {
			expect(body).to.equal('fprsf1i1nva1l1ptsl');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('GET', '/a/asd', (body) => {
			expect(body).to.equal('fprsf1prm1asdptm1l1ptsl');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('GET', '/a/asd/bla/blu', (body) => {
			expect(body).to.equal('fprsf1prm1asdblabluptm1l1ptsl');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('GET', '/a/b', (body) => {
			expect(body).to.equal('fprsf1prs1f2i2g2a2l2pts1l1ptsl');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('POST', '/a/b', (body) => {
			expect(body).to.equal('fprsf1prs1f2i2nva2l2pts1l1ptsl');
			done();
		});
	});

	it('should pass', (done) => {
		makeRequest('GET', '/a/b/zxc', (body) => {
			expect(body).to.equal('fprsf1prs1f2prm2zxcptm2l2pts1l1ptsl');
			done();
		});
	});
});
