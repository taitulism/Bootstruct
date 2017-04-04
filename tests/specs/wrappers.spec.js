const http = require('http');
const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Wrappers test', function() {
    const app    = bts('./tests/Wrappers');
    const server = http.createServer(app);


    beforeEach(function() {
        server.listen(8181, '127.0.0.1');
    });
    afterEach(function() {
        server.close();
    });


    it('should pass', function (done) {
        makeRequest('/', 'fl', done, server);
    });

    it('should pass', function (done) {
        makeRequest('/a', 'ff1l1l', done, server);
    });

    it('should pass', function (done) {
        makeRequest('/a/b', 'ff1f2l2l1l', done, server);
    });
});
