'use strict';

const isArray = require('./is-array');
const error   = require('../errors');

module.exports = {

     /*
	  ┌──────────────────────────────────────────────────
	  │ validate a require(path) returns a function
	  │ returns: module | null (valid|invalid)
	 */
	fn (path) {
		const req  = require(path);
		const type = typeof req;

		if (type === 'function') {
			return req;
		}

		return error.expectedAFunction(path, type);
	},


    /*
	 ┌──────────────────────────────────────────
	 │ validate a require(path) returns an object
	 │ returns: module | null (valid|invalid)
	*/
	obj (path) {
		const req  = require(path);
		const type = typeof req;

		// typeof null == 'object'. it would count as invalid
		if (type === 'object' && !isArray(req)) {
			return req;
		}

		return error.expectedAnObject(path, type);
	}
};
