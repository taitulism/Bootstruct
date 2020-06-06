const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Target-chain test', function () {
	const app    = bts('./tests/app-folders/Target');
	const server = http.createServer(app);

	before(() => server.listen(8181, '127.0.0.1'));
	after(() => server.close());

	it('GET /', async () => {
		const res = await makeRequest('GET', '/');
		const expected = [
			'before-verb',
			'get',
			'after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('POST /', async () => {
		const res = await makeRequest('POST', '/');
		const expected = [
			'before-verb',
			'after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('GET /A', async () => {
		const res = await makeRequest('GET', '/a');
		const expected = [
			'a-before-verb',
			'a-no-verb',
			'a-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('POST /A', async () => {
		const res = await makeRequest('POST', '/a');
		const expected = [
			'a-before-verb',
			'a-post',
			'a-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('GET /A/B', async () => {
		const res = await makeRequest('GET', '/a/b');
		const expected = [
			'b-before-verb',
			'b-no-verb',
			'b-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('PUT /A/B', async () => {
		const res = await makeRequest('PUT', '/a/b');
		const expected = [
			'b-before-verb',
			'b-put',
			'b-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('GET /A/B/C', async () => {
		const res = await makeRequest('GET', '/a/b/c');
		const expected = [
			'c-index',
			'c-no-verb',
			'c-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('DELETE /A/B/C', async () => {
		const res = await makeRequest('DELETE', '/a/b/c');
		const expected = [
			'c-index',
			'c-delete',
			'c-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('GET /A/B/C/D', async () => {
		const res = await makeRequest('GET', '/a/b/c/d');
		const expected = [
			'd-index',
			'd-get',
			'd-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('POST /A/B/C/D', async () => {
		const res = await makeRequest('POST', '/a/b/c/d');
		const expected = [
			'd-index',
			'd-post',
			'd-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('PUT /A/B/C/D', async () => {
		const res = await makeRequest('PUT', '/a/b/c/d');
		const expected = [
			'd-index',
			'c-no-verb', // delegated
			'd-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('GET /A/B/C/D/E', async () => {
		const res = await makeRequest('GET', '/a/b/c/d/e');
		const expected = [
			'e-get',
			'e-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('POST /A/B/C/D/E', async () => {
		const res = await makeRequest('POST', '/a/b/c/d/e');
		const expected = [
			'e-post',
			'e-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('PUT /A/B/C/D/E', async () => {
		const res = await makeRequest('PUT', '/a/b/c/d/e');
		const expected = [
			'e-put',
			'e-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});

	it('DELETE /A/B/C/D/E', async () => {
		const res = await makeRequest('DELETE', '/a/b/c/d/e');
		const expected = [
			'c-no-verb',
			'e-after-verb',
		].join('');

		expect(res).to.equal(expected);
	});
});
