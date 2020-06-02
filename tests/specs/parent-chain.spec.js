const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Parent-chain test', function () {
	const app    = bts('./tests/app-folders/Parent');
	const server = http.createServer(app);

	before(() => server.listen(8181, '127.0.0.1'));
	after(() => server.close());

	it('GET /A/method', async () => {
		const res = await makeRequest('GET', '/a/method');
		const expected = [
			'pre-sub',
			'a-method',
			'post-sub',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('GET /A/B/method', async () => {
		const res = await makeRequest('GET', '/a/b/method');
		const expected = [
			'pre-sub',
			'a-pre-sub',
			'b-method',
			'a-post-sub',
			'post-sub',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('GET /A/B/C/method', async () => {
		const res = await makeRequest('GET', '/a/b/c/method');
		const expected = [
			'pre-sub',
			'a-pre-sub',
			'b-pre-sub',
			'c-method',
			'b-post-sub',
			'a-post-sub',
			'post-sub',
		].join('');

		return expect(res).to.equal(expected);
	});
});
