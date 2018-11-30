const http = require('http');
const bts  = require('../../');
const makeRequest = require('../make-request');

describe('io.params test', function() {
    const app    = bts('./tests/app-folders/Params');
    const server = http.createServer(app);


    beforeEach(function() {
        server.listen(8181, '127.0.0.1');
    });
    afterEach(function() {
        server.close();
    });

    it('should pass', function (done) {
        makeRequest('/a/b/c/d/e', 'a,b,c,d,e|b,c,d,e|c,d,e|c,d,e|c,d,e|c,d,e', done, server);
    });
});
