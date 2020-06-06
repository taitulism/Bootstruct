const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Full use case test', function () {
	const app    = bts('./tests/app-folders/www');
	const server = http.createServer(app);

	before(() => server.listen(8181, '127.0.0.1'));
	after(() => server.close());

	it('GET /', async () => {
		const res = await makeRequest('GET', '/');
		const expected = [
			'in',
			'index',
			'get',
			'after-verb',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('ignores: GET /_underscore', async () => {
		// same as 'GET /'
		const res = await makeRequest('GET', '/_underscore');
		const expected = [
			'in',
			'index',
			'get',
			'after-verb',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('POST /', async () => {
		const res = await makeRequest('POST', '/');
		const expected = [
			'in',
			'index',
			'post',
			'after-verb',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('PUT /', async () => {
		const res = await makeRequest('PUT', '/');
		const expected = [
			'in',
			'index',
			'after-verb',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('DELETE /whatever', async () => {
		const res = await makeRequest('DELETE', '/whatever');
		const expected = [
			'in',
			'index',
			'whatever',
			'after-verb',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('PUT /method', async () => {
		const res = await makeRequest('PUT', '/method');
		const expected = [
			'in',
			'pre-method',
			'method',
			'post-method',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('GET /A', async () => {
		const res = await makeRequest('GET', '/a');
		const expected = [
			'in',
			'pre-sub',
			'a-in',
			'a-index',
			'a-get',
			'a-after-verb',
			'a-out',
			'post-sub',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('POST /A', async () => {
		const res = await makeRequest('POST', '/a');
		const expected = [
			'in',
			'pre-sub',
			'a-in',
			'a-index',
			'a-no-verb',
			'a-after-verb',
			'a-out',
			'post-sub',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('GET /A/method', async () => {
		const res = await makeRequest('GET', '/a/method');
		const expected = [
			'in',
			'pre-sub',
			'a-in',
			'a-pre-method',
			'a-method',
			'a-post-method',
			'a-out',
			'post-sub',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('GET /A/method/whatever/bro', async () => {
		const res = await makeRequest('GET', '/a/method/whatever/bro');
		const expected = [
			'in',
			'pre-sub',
			'a-in',
			'a-pre-method',
			'a-method',
			'whatever-bro',
			'a-post-method',
			'a-out',
			'post-sub',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('GET /A/B', async () => {
		const res = await makeRequest('GET', '/a/b');
		const expected = [
			'in',
			'pre-sub',
			'a-in',
			'a-pre-sub',
			'b-in',
			'b-index',
			'b-get',
			'b-after-verb',
			'b-out',
			'a-post-sub',
			'a-out',
			'post-sub',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('POST /A/B', async () => {
		const res = await makeRequest('POST', '/a/b');
		const expected = [
			'in',
			'pre-sub',
			'a-in',
			'a-pre-sub',
			'b-in',
			'b-index',
			'a-no-verb', // delegated
			'b-after-verb',
			'b-out',
			'a-post-sub',
			'a-out',
			'post-sub',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});

	it('GET /A/B/method', async () => {
		const res = await makeRequest('GET', '/a/b/method');
		const expected = [
			'in',
			'pre-sub',
			'a-in',
			'a-pre-sub',
			'b-in',
			'b-pre-method',
			'b-method',
			'b-post-method',
			'b-out',
			'a-post-sub',
			'a-out',
			'post-sub',
			'out',
		].join('');

		return expect(res).to.equal(expected);
	});
});
