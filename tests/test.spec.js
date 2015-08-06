var forIn   = require('../lib/utils/forin');
var request = require('request');
var http    = require('http');
var sep     = require('path').sep;
var bts     = require('../');
var app     = bts('./tests/www');

/* 
 * key   = url to test
 * value = the expected string, as array
 */
var testsObj = {
	'/'        : ['www/first.js', 'www/index.js', 'www/get.js', 'www/last.js'],
	'/foo'     : ['www/first.js', 'www/foo/first.js', 'www/foo/index.js', 'www/foo/verbs/get.js', 'www/foo/last.js', 'www/last.js'],
	'/foo/bar' : ['www/first.js', 'www/foo/first.js', 'www/foo/bar/first.js', 'www/foo/bar/index.js', 'www/foo/bar/get.js', 'www/foo/bar/last.js', 'www/foo/last.js', 'www/last.js'],
	'/baz'     : ['www/first.js', 'www/baz.js', 'www/last.js']
};


// resolve array to string and normalize OS path seperator
function resolveExpected (url, flowArry) {
	var resolved = flowArry.map(function (item,i) {
		return item.replace(/\//g, sep);
	});

	// returned example: "www\first.js>www\index.js>www\get.js>www\last.js"
	return resolved.join('>');
}

describe('Bootstruct', function() {

	forIn(testsObj, function (url, flowArry) {
		var expectedStr = resolveExpected(url, flowArry);
		
		it('expecting: ' + expectedStr, function(done) {
			// start server
			var server = http.createServer(app).listen(1001, '127.0.0.1');

			// request
			request('http://localhost:1001' + url, function(err, response, body) {
				if (err) {
					console.log('request-module error:\n',err);
					return;
				}
				expect(body).toEqual(expectedStr);

				// stop server
				server.close();

				done();
			});
		});
		
	});

});
