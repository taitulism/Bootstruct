const http = require('http');
const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Method-chain test', function() {
    const app    = bts('./tests/Method');
    const server = http.createServer(app);


    beforeEach(function() {
        server.listen(8181, '127.0.0.1');
    });
    afterEach(function() {
        server.close();
    });


    it('should pass', function (done) {
        makeRequest('/a1', 'preapost', done, server);
    });

    it('should pass', function (done) {
        makeRequest('/a/b1', 'prebpost', done, server);
    });

    it('should pass', function (done) {
        makeRequest('/a/b/c1', 'precpost', done, server);
    });
});
