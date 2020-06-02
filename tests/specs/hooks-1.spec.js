/* eslint-disable */

const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('hooks - files', function() {
    const app    = bts('./tests/app-folders/hooks1');
    const server = http.createServer(app);

    before(() => server.listen(8181, '127.0.0.1'));
	after(() => server.close());

	describe('app.item hook', async () => {
		it('loads props on the `app` instance', async () => {
			const res = await makeRequest('GET', '/item');
			return expect(res).to.equal('custom-item');
		});
	});

	describe('ignore hook', async () => {
		it('ignores entries with given name', async () => {
			const res = await makeRequest('GET', '/ignored');
			return expect(res).to.equal('');
		});
	});

	describe('io_init hook', async () => {
		it('runs code on io init', async () => {
			const res = await makeRequest('GET', '/io_init');
			return expect(res).to.equal('io-initiated');
		});
    });

	describe('io_exit hook', async () => {
		it('runs code on io exit', async () => {
			const res = await makeRequest('GET', '/io_exit');
			return expect(res).to.equal('io_exit');
		});
    });

	describe('ctrl_proto hook', async () => {
		it('extends the ctrl prototype', async () => {
			const res = await makeRequest('GET', '/ctrl_proto');
			return expect(res).to.equal('ctrl_proto');
		});
    });

	describe('io_proto hook', async () => {
		it('extends the io prototype', async () => {
			const res = await makeRequest('GET', '/io_proto');
			return expect(res).to.equal('io_proto');
		});
	});

	describe('ctrl_hooks hook', async () => {
		it('is a file hook on the controller', async () => {
			const res = await makeRequest('GET', '/ctrl_hooks');
			const expected = [
				'ctrl-hook-this',
				'ctrl-hook-arg',
				'public',
			].join('');
			return expect(res).to.equal(expected);
		});
	});

	describe('a_shared_method hook', async () => {
		it('adds a shared method to all controllers', async () => {
			const res = await makeRequest('GET', '/a_shared_method');
			expect(res).to.equal('shared_method');
		});

		it('invoke pre & post method hooks', async () => {
			const res = await makeRequest('GET', '/a/a_shared_method');
			const expected = [
				'a-pre-method',
				'shared_method',
				'a-post-method',
			].join('');
			return expect(res).to.equal(expected);
		});
	});
});
