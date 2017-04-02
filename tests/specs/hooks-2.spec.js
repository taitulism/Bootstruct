const http = require('http');
const bts  = require('../../');
const makeRequest = require('../make-request');

describe('hooks 2 test', function() {
    const app    = bts('./tests/hooks2');
    const server = http.createServer(app);


    beforeEach(function() {
        server.listen(8181, '127.0.0.1');
    });
    afterEach(function() {
        server.close();
    });


    it('should pass all tests', function (done) {
        makeRequest('/', '[io_init-c_pro1-c_pro2-io_pro1-io_pro2-pub-view-item]exit', done, server);
    });

    it('should pass sub_methods 1 test', function (done) {
        makeRequest('/m1', '[shared_m1]', done, server);
    });

    it('should pass sub_methods 2 test', function (done) {
        makeRequest('/a/m2', '[{shared_m2}]', done, server);
    });

    it('should pass sub_ctrls 1 test', function (done) {
        makeRequest('/x', '[X1X2X3]', done, server);
    });

    it('should pass sub_ctrls 2 test', function (done) {
        makeRequest('/a/x', '[{X1X2X3}]', done, server);
    });
});
