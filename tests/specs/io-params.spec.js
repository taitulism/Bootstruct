const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('io.params test', function () {
	const app    = bts('./tests/app-folders/Params');
	const server = http.createServer(app);

	before(() => server.listen(8181, '127.0.0.1'));
	after(() => server.close());

	it('each controller removes its name from params', async () => {
		const res = await makeRequest('GET', '/a/b/c/d');

		expect(res).to.equal('a,b,c,d|b,c,d|c,d|c,d|c,d|c,d');
	});

	it('handles regular params', async () => {
		const res = await makeRequest('GET', '/regular-params/season/3/episode/9');
		const expected = [
			'regular-params,season,3,episode,9|',
			'season,3,episode,9',
			'season,3,episode,9',
		].join('');

		expect(res).to.equal(expected);
	});

	it('handles smart params', async () => {
		const res = await makeRequest('GET', '/smart-params/season/3/episode/9');
		const expected = [
			'smart-params,season,3,episode,9|',
			'season:3,episode:9',
			'season,3,episode,9',
		].join('');

		expect(res).to.equal(expected);
	});
});
