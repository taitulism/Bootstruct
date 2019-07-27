/* eslint-disable
	no-console,
	max-params,
	newline-before-return,
*/
const request = require('request');
const {expect}  = require('chai');

module.exports = makeRequest;

function makeRequest (url, expectRes, done, server, verb) {
	verb = verb || 'get';

	request[verb](`http://localhost:8181${url}`, function (err, response, body) {
		if (err) {
			requestErr(err);
			return;
		}

		expect(body).to.equal(expectRes);

		done && done();
	});
}

function requestErr (err) {
	console.log('request-module ERROR:\n', err);
}
