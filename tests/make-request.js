/* eslint-disable
	no-console,
	max-params,
	newline-before-return,
*/
const http = require('http');

module.exports = makeRequest;

const options = {
	hostname: '127.0.0.1',
	port: 8181,
};

function makeRequest (verb, path, callback) {
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
				callback(body);
			});
	});

	req.on('error', (err) => {
		console.log('makeRequest ERROR:\n', err);
	});

	req.end();
}
