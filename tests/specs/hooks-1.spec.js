/* eslint-disable */

const http = require('http');
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


    it('should pass ignore test', function (done) {
        makeRequest('/ignored', '', done);
    });

    it('should pass io_init test', function (done) {
        makeRequest('/io_init', 'io_init', done);
    });

    it('should pass io_exit test', function (done) {
        makeRequest('/io_exit', 'io_exit', done);
    });

    it('should pass ctrl_proto test', function (done) {
        makeRequest('/ctrl_proto', 'ctrl_proto', done);
    });

    it('should pass io_proto test', function (done) {
        makeRequest('/io_proto', 'io_proto', done);
    });

    it('should pass ctrl_hooks test', function (done) {
        makeRequest('/ctrl_hooks', 'public', done);
    });

    it('should pass shared_methods test', function (done) {
        makeRequest('/a_shared_method', 'shared_methods', done);
    });

    it('should pass item test', function (done) {
        makeRequest('/item', 'item', done);
    });
});
