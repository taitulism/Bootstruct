/* eslint-disable */

const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Hooks - Files', function() {
    const app    = bts('./tests/app-folders/hooks1');
    const server = http.createServer(app);

    before(() => server.listen(8181, '127.0.0.1'));
	after(() => server.close());

	describe('Hook: app.item', () => {
		it('loads props on the `app` instance', async () => {
			const res = await makeRequest('GET', '/item');
			return expect(res).to.equal('custom-item');
		});
	});

	describe('Hook: ignore', () => {
		it('ignores entries with given name', async () => {
			const res = await makeRequest('GET', '/ignored');
			return expect(res).to.equal('');
		});
	});

	describe('Hook: io_init', () => {
		it('runs code on io init', async () => {
			const res = await makeRequest('GET', '/io-init');
			return expect(res).to.equal('io-initiated');
		});
    });

	describe('Hook: io_exit', () => {
		it('runs code on io exit', async () => {
			const res = await makeRequest('GET', '/io-exit');
			return expect(res).to.equal('io-exit');
		});
    });

	describe('Hook: ctrl_proto', () => {
		it('extends the ctrl prototype', async () => {
			const res = await makeRequest('GET', '/ctrl-proto');
			return expect(res).to.equal('ctrl-proto');
		});
    });

	describe('Hook: io_proto', () => {
		it('extends the io prototype', async () => {
			const res = await makeRequest('GET', '/io-proto');
			return expect(res).to.equal('io-proto');
		});
	});

	describe('Hook: ctrl_hooks', () => {
		it('is a file hook on the controller', async () => {
			const res = await makeRequest('GET', '/ctrl-hooks');
			const expected = [
				'ctrl-hook-this',
				'ctrl-hook-arg',
				'public',
			].join('');
			return expect(res).to.equal(expected);
		});
	});

	describe('Hook: a_shared_method', () => {
		it('adds a shared method to all controllers', async () => {
			const res = await makeRequest('GET', '/a-shared-method');
			expect(res).to.equal('shared-method');
		});

		it('invokes pre & post method hooks', async () => {
			const res = await makeRequest('GET', '/a/a-shared-method');
			const expected = [
				'a-pre-method',
				'shared-method',
				'a-post-method',
			].join('');
			return expect(res).to.equal(expected);
		});
	});
});
