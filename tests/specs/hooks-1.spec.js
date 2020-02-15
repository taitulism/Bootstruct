/* eslint-disable */

const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('hooks 1 test', function() {
    const app    = bts('./tests/app-folders/hooks1');
    const server = http.createServer(app);


    beforeEach(function() {
        server.listen(8181, '127.0.0.1');
    });
    afterEach(function() {
        server.close();
    });


    it('should pass ignore test', (done) => {
        makeRequest('GET', '/ignored', (body) => {
			expect(body).to.equal('');
			done();
		});
    });

    it('should pass io_init test', (done) => {
        makeRequest('GET', '/io_init', (body) => {
			expect(body).to.equal('io_init');
			done();
		});
    });

    it('should pass io_exit test', (done) => {
        makeRequest('GET', '/io_exit', (body) => {
			expect(body).to.equal('io_exit');
			done();
		});
    });

    it('should pass ctrl_proto test', (done) => {
        makeRequest('GET', '/ctrl_proto', (body) => {
			expect(body).to.equal('ctrl_proto');
			done();
		});
    });

    it('should pass io_proto test', (done) => {
        makeRequest('GET', '/io_proto', (body) => {
			expect(body).to.equal('io_proto');
			done();
		});
    });

    it('should pass ctrl_hooks test', (done) => {
        makeRequest('GET', '/ctrl_hooks', (body) => {
			expect(body).to.equal('public');
			done();
		});
    });

    it('should pass shared_methods test', (done) => {
        makeRequest('GET', '/a_shared_method', (body) => {
			expect(body).to.equal('shared_methods');
			done();
		});
    });

    it('should pass item test', (done) => {
        makeRequest('GET', '/item', (body) => {
			expect(body).to.equal('item');
			done();
		});
    });
});
