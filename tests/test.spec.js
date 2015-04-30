var request = require('request');
var http = require('http');
var bts = require('../');
var app = bts.start('./tests/app');

http.createServer(app).listen(1001, '127.0.0.1');

describe('bootstruct', function() {
	it("should respond with Bootstruct's flow", function(done) {
		request("http://localhost:1001/", function(error, response, body) {

			var expected = 'app\\first.js>app\\all.js>app\\get.js>app\\last.js>';

			expect(body).toEqual(expected);
			done();
		});
	});
});

