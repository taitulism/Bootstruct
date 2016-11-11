'use strict';

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

		console.log(`Bootstruct Error: ${path}`);
		console.log(`    This entry is expected to export a single function. Got: ${type}`);

		return null;
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
		if (type === 'object' && !Array.isArray(req)) {
			return req;
		}

		console.log(`Bootstruct Error: ${path}`);
		console.log(`    This entry is expected to export an object. Got: ${type}`);

		return null;
	}
};
