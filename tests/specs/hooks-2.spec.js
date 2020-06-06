const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Hooks - Folders', function () {
	const app    = bts('./tests/app-folders/hooks2');
	const server = http.createServer(app);

	before(() => server.listen(8181, '127.0.0.1'));
	after(() => server.close());

	// describe('a_shared_method hook', () => {
	// 	it('should pass all tests', async () => {
	// 		const res = await makeRequest('GET', '/');
	// 		const expected = [
	// 			'io-initiated',
	// 		].join('');

	// 		expect(res).to.equal('[io_init-c_pro1-c_pro2-io_pro1-io_pro2-pub-view-item]exit');
	// 	});
	// });

	describe('Hook: ignore', () => {
		it('ignores entries with given names', async () => {
			const res = await makeRequest('GET', '/ignored');
			const expected = [
				'in',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});
	});

	describe('Hook: io_init', () => {
		it('called before first controller', async () => {
			const res = await makeRequest('GET', '/io-init');
			const expected = [
				'in',
				'io-initiated',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});
	});

	describe('Hook: io_proto', () => {
		it('loads methods on the io prototype', async () => {
			const res = await makeRequest('GET', '/io-proto');
			const expected = [
				'in',
				'proto-method-1',
				'proto-method-2',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});
	});

	describe('Hook: io_exit', () => {
		it('runs code on io exit', async () => {
			const res = await makeRequest('GET', '/io-exit');
			const expected = [
				'in',
				'out',
				'io-exit',
			].join('');

			return expect(res).to.equal(expected);
		});
	});

	describe('Hook: ctrl_proto', () => {
		it('loads methods on the io prototype', async () => {
			const res = await makeRequest('GET', '/ctrl-proto');
			const expected = [
				'in',
				'ctrl-proto-method-1',
				'ctrl-proto-method-2',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});
	});

	describe('Hook: ctrl hooks', () => {
		it('controller file hook', async () => {
			const res = await makeRequest('GET', '/config');
			const expected = [
				'in',
				'my-settings-1',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});

		it('controller folder hook', async () => {
			const res = await makeRequest('GET', '/ctrl-hook');
			const expected = [
				'in',
				'a-string',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});
	});

	describe('Hook: shared_methods', () => {
		it('shared method file', async () => {
			const res = await makeRequest('GET', '/method-1');
			const expected = [
				'in',
				'shared_method-1',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});

		it('shared method folder', async () => {
			const res = await makeRequest('GET', '/a/method-2');
			const expected = [
				'in',
				'a-pre-method',
				'shared_method-2',
				'a-post-method',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});
	});

	describe('Hook: shared_ctrls', () => {
		it('shared controller on root', async () => {
			const res = await makeRequest('GET', '/x');
			const expected = [
				'in',
				'x-in',
				'x-index',
				'x-out',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});

		it('shared controller on sub-controller', async () => {
			const res = await makeRequest('GET', '/a/x');
			const expected = [
				'in',
				'a-pre-sub',
				'x-in',
				'x-index',
				'x-out',
				'a-post-sub',
				'out',
			].join('');

			expect(res).to.equal(expected);
		});
	});
});
