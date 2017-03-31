var request = require('request');
var http    = require('http');
var sep     = require('path').sep;

var forIn   = require('../lib/utils/for-in');
var bts     = require('../');

function makeRequest (url, expectRes, done, server, verb) {
	verb = verb || 'get';

	request[verb]('http://localhost:8181' + url, function(err, response, body) {
		/* Deal Breaker */ if (err) { requestErr(err); return; }

		expect(body).toEqual(expectRes);

		done && done();
	});
}

function requestErr (err) {
	console.log('request-module ERROR:\n',err);
	return;
}

describe('Bootstruct', function() {

	describe('Wrappers test', function() {
		var app    = bts('./tests/Wrappers');
		var server = http.createServer(app);


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




	describe('Method-chain test', function() {
		var app    = bts('./tests/Method');
		var server = http.createServer(app);


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




	describe('Parent-chain test', function() {
		var app    = bts('./tests/Parent');
		var server = http.createServer(app);


		beforeEach(function() {
			server.listen(8181, '127.0.0.1');
		});
		afterEach(function() {
			server.close();
		});


		it('should pass', function (done) {
			makeRequest('/a/b1', 'prebpost', done, server);
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c1', 'prepre1cpost1post', done, server);
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c/d1', 'prepre1pre2dpost2post1post', done, server);
		});
	});




	describe('Target-chain test', function() {
		var app    = bts('./tests/Target');
		var server = http.createServer(app);


		beforeEach(function() {
			server.listen(8181, '127.0.0.1');
		});
		afterEach(function() {
			server.close();
		});

		it('should pass', function (done) {
			makeRequest('/', 'b4getftr', done, server, 'get');
		});

		it('should pass', function (done) {
			makeRequest('/', 'b4ftr', done, server, 'post');
		});

		it('should pass', function (done) {
			makeRequest('/a', 'b41nvaftr1', done, server, 'get');
		});

		it('should pass', function (done) {
			makeRequest('/a', 'b41postftr1', done, server, 'post');
		});

		it('should pass', function (done) {
			makeRequest('/a/b', 'b42nvbftr2', done, server, 'get');
		});

		it('should pass', function (done) {
			makeRequest('/a/b', 'b42putftr2', done, server, 'put');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c', 'b43nvcftr3', done, server, 'get');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c', 'b43delftr3', done, server, 'del');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c/d', 'b44getftr4', done, server, 'get');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c/d', 'b44postftr4', done, server, 'post');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c/d', 'b44nvcftr4', done, server, 'put');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c/d/e', 'getftr5', done, server, 'get');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c/d/e', 'postftr5', done, server, 'post');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c/d/e', 'putftr5', done, server, 'put');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/c/d/e', 'nvcftr5', done, server, 'del');
		});
	});



	describe('io.params test', function() {
		var app    = bts('./tests/Params');
		var server = http.createServer(app);


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



	describe('Full use case test', function() {
		var app    = bts('./tests/www');
		var server = http.createServer(app);


		beforeEach(function() {
			server.listen(8181, '127.0.0.1');
		});
		afterEach(function() {
			server.close();
		});


		it('should pass', function (done) {
			makeRequest('/', 'figal', done, server, 'get');
		});

		it('should pass', function (done) {
			makeRequest('/', 'fial', done, server, 'post');
		});

		it('should pass', function (done) {
			makeRequest('/bla', 'fiblaal', done, server, 'post');
		});

		it('should pass', function (done) {
			makeRequest('/qwe', 'fprmqweptml', done, server, 'put');
		});

		it('should pass', function (done) {
			makeRequest('/a', 'fprsf1i1g1a1l1ptsl', done, server, 'get');
		});

		it('should pass', function (done) {
			makeRequest('/a', 'fprsf1i1nva1l1ptsl', done, server, 'post');
		});

		it('should pass', function (done) {
			makeRequest('/a/asd', 'fprsf1prm1asdptm1l1ptsl', done, server);
		});

		it('should pass', function (done) {
			makeRequest('/a/asd/bla/blu', 'fprsf1prm1asdblabluptm1l1ptsl', done, server);
		});

		it('should pass', function (done) {
			makeRequest('/a/b', 'fprsf1prs1f2i2g2a2l2pts1l1ptsl', done, server, 'get');
		});

		it('should pass', function (done) {
			makeRequest('/a/b', 'fprsf1prs1f2i2nva2l2pts1l1ptsl', done, server, 'post');
		});

		it('should pass', function (done) {
			makeRequest('/a/b/zxc', 'fprsf1prs1f2prm2zxcptm2l2pts1l1ptsl', done, server);
		});
	});




	describe('hooks 1 test', function() {
		var app    = bts('./tests/hooks1');
		var server = http.createServer(app);


		beforeEach(function() {
			server.listen(8181, '127.0.0.1');
		});
		afterEach(function() {
			server.close();
		});


		it('should pass ignore test', function (done) {
			makeRequest('/ignored', '', done, server);
		});

		it('should pass io_init test', function (done) {
			makeRequest('/io_init', 'io_init', done, server);
		});

		it('should pass io_exit test', function (done) {
			makeRequest('/io_exit', 'io_exit', done, server);
		});

		it('should pass ctrl_proto test', function (done) {
			makeRequest('/ctrl_proto', 'ctrl_proto', done, server);
		});

		it('should pass io_proto test', function (done) {
			makeRequest('/io_proto', 'io_proto', done, server);
		});

		it('should pass ctrl_hooks test', function (done) {
			makeRequest('/ctrl_hooks', 'public', done, server);
		});

		it('should pass shared_methods test', function (done) {
			makeRequest('/a_shared_method', 'shared_methods', done, server);
		});

		it('should pass item test', function (done) {
			makeRequest('/item', 'item', done, server);
		});
	});



	describe('hooks 2 test', function() {
		var app    = bts('./tests/hooks2');
		var server = http.createServer(app);


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

});
