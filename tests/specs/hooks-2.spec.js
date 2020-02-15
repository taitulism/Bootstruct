const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('hooks 2 test', function () {
	const app    = bts('./tests/app-folders/hooks2');
	const server = http.createServer(app);


	beforeEach(function () {
		server.listen(8181, '127.0.0.1');
	});
	afterEach(function () {
		server.close();
	});


	it('should pass all tests', function (done) {
		makeRequest('GET', '/', (body) => {
			expect(body).to.equal('[io_init-c_pro1-c_pro2-io_pro1-io_pro2-pub-view-item]exit');
			done();
		});
	});

	it('should pass sub_methods 1 test', function (done) {
		makeRequest('GET', '/m1', (body) => {
			expect(body).to.equal('[shared_m1]');
			done();
		});
	});

	it('should pass sub_methods 2 test', function (done) {
		makeRequest('GET', '/a/m2', (body) => {
			expect(body).to.equal('[{shared_m2}]');
			done();
		});
	});

	it('should pass sub_ctrls 1 test', function (done) {
		makeRequest('GET', '/x', (body) => {
			expect(body).to.equal('[X1X2X3]');
			done();
		});
	});

	it('should pass sub_ctrls 2 test', function (done) {
		makeRequest('GET', '/a/x', (body) => {
			expect(body).to.equal('[{X1X2X3}]');
			done();
		});
	});
});
