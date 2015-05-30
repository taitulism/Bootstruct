var forIn   = require('../lib/utils/forin');
var request = require('request');
var http    = require('http');
var sep     = require('path').sep;
var bts     = require('../');
var app     = bts('./tests/app');

/* 
 * key   = url to test
 * value = the expected string, as array
 */
var testsObj = {
	'/'        : ['app/first.js', 'app/index.js', 'app/get.js', 'app/last.js'],
	'/foo'     : ['app/first.js', 'app/foo/first.js', 'app/foo/index.js', 'app/foo/verbs/get.js', 'app/foo/last.js', 'app/last.js'],
	'/foo/bar' : ['app/first.js', 'app/foo/first.js', 'app/foo/bar/first.js', 'app/foo/bar/index.js', 'app/foo/bar/get.js', 'app/foo/bar/last.js', 'app/foo/last.js', 'app/last.js'],
	'/baz'     : ['app/first.js', 'app/baz.js', 'app/last.js']
};


// resolve array to string and normalize OS path seperator
function resolveExpected (url, flowArry) {
	var resolved = flowArry.map(function (item,i) {
		return item.replace(/\//g, sep);
	});

	// returned example: "app\first.js>app\index.js>app\get.js>app\last.js"
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
