'use strict';


const helpers = {


	/*
	  ┌────────────────────────────────────────────────
	  │ returns lowerCased extension-less entryname.
	 */
	normalizeEntryName (entryName, isFile) {
		const name = entryName.toLowerCase();

		if (typeof isFile === 'undefined') {
			isFile = true;
		}

		return (isFile) ? helpers.removeExt(name) : name;
	},


	/*
	  ┌─────────────────────────
	  │ removes file extension
	 */
	removeExt (name) {
		const lastDot = name.lastIndexOf('.');

		// at least 1 char before dot
		// nor a folder or a .dotFile
		if (lastDot >= 1) {
			name = name.substr(0, lastDot);
		}

		return name;
	},


	/*
	  ┌──────────────────────────────────────────────────
	  │ validate a require(path) returns a function
	  │ returns: module | null (valid|invalid)
	 */
	tryReqFn (path) {
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
	tryReqObj (path) {
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


// ----------------------
module.exports = helpers;
