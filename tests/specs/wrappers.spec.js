const http = require('http');
const {expect}  = require('chai');

const bts  = require('../../');
const makeRequest = require('../make-request');

describe('Wrappers test', () => {
	const app    = bts('./tests/app-folders/Wrappers');
	const server = http.createServer(app);

	before(() => server.listen(8181, '127.0.0.1'));
	after(() => server.close());

	it('GET /', async () => {
		const res = await makeRequest('GET', '/');

		return expect(res.split('/')).to.eql(['in', 'out']);
	});

	it('GET /A', async () => {
		const res = await makeRequest('GET', '/a');

		return expect(res.split('/')).to.eql(['in', 'a-in', 'a-out', 'out']);
	});

	it('POST /A/B', async () => {
		const res = await makeRequest('POST', '/a/b');
		const expected = [
			'in',
			'a-in',
			'b-in',
			'b-out',
			'a-out',
			'out',
		];

		return expect(res.split('/')).to.eql(expected);
	});
});
