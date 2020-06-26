const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Method-chain test', function () {
	const app    = bts('./tests/app-folders/Method');
	const server = http.createServer(app);

	before(() => server.listen(8181, '127.0.0.1'));
	after(() => server.close());

	it('GET /method', async () => {
		const res = await makeRequest('GET', '/method');

		return expect(res.split('/')).to.eql(['pre-method', 'method', 'post-method']);
	});

	it('GET /A/method', async () => {
		const res = await makeRequest('GET', '/a/method');

		return expect(res.split('/')).to.eql(['a-pre-method', 'a-method', 'a-post-method']);
	});

	it('POST /A/B/method', async () => {
		const res = await makeRequest('POST', '/a/b/method');

		return expect(res.split('/')).to.eql(['b-pre-method', 'b-method', 'b-post-method']);
	});

	it('_INDEX_ONLY file turns a folder into a method (instead of a controller)', async () => {
		const res = await makeRequest('GET', '/a/b/method-folder');

		return expect(res.split('/')).to.eql(['b-pre-method', 'b-method-folder', 'b-post-method']);
	});
});
