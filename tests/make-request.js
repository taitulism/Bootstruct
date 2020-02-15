/* eslint-disable
	no-console,
	max-params,
	newline-before-return,
*/
const http = require('http');
const {expect}  = require('chai');

module.exports = makeRequest;

const options = {
	hostname: '127.0.0.1',
	port: 8181,
};

function makeRequest (path, expectRes, done, verb = 'GET') {
	options.path = path;
	options.method = verb.toUpperCase();

	const req = http.request(options, (response) => {
		let body = '';

		response
			.setEncoding('utf8')
			.on('data', (chunk) => {
				body += chunk;
			})
			.on('end', () => {
				expect(body).to.equal(expectRes);
				done && done();
			});
	});

	req.on('error', (err) => {
		console.log('makeRequest ERROR:\n', err);
	});

	req.end();
}
