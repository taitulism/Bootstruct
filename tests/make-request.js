/* eslint-disable no-console, max-params */
const request = require('request');
const expect  = require('chai').expect;

module.exports = makeRequest;

function makeRequest (url, expectRes, done, server, verb) {
	verb = verb || 'get';

	request[verb](`http://localhost:8181${url}`, function(err, response, body) {
		if (err) {
			requestErr(err);
			return;
		}

		expect(body).to.eql(expectRes);

		done && done();
	});
}

function requestErr (err) {
	console.log('request-module ERROR:\n', err);
	return;
}
