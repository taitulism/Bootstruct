'use strict';


var helpers = {


	/*
	  ┌────────────────────────────────────────────────
	  │ returns lowerCased extension-less entryname.
	 */
	normalizeEntryName: function (entryName, isFile) {
		var name = entryName.toLowerCase();

		if (typeof isFile == 'undefined') {
			isFile = true;
		}

		return (isFile) ? helpers.removeExt(name) : name;
	},


	/*
	  ┌─────────────────────────
	  │ removes file extension
	 */
	removeExt: function (name) {
		var lastDot = name.lastIndexOf('.');

		if (~lastDot && lastDot !== 0) {
			name = name.substr(0, lastDot);
		}

		return name;
	},


	/*
	  ┌──────────────────────────────────────────────────
	  │ validate a require(path) returns a function
	  │ returns: module | null (valid|invalid)
	 */
	tryReqFn: function (path) {
		var req  = require(path);
		var type = typeof req;

		if (type == 'function') {
			return req;
		}

		console.log('Bootstruct Error: ' + path);
		console.log('    This entry is expected to export a single function. Got: ' + type);

		return null;
	},


	/*
	  ┌──────────────────────────────────────────
	  │ validate a require(path) returns an object
	  │ returns: module | null (valid|invalid)
	 */
	tryReqObj: function (path) {
		var req  = require(path);
		var type = typeof req;

		// typeof null == 'object'. it would count as invalid
		if (type == 'object' && !Array.isArray(req)) {
			return req;
		}

		console.log('Bootstruct Error: ' + path);
		console.log('    This entry is expected to export an object. Got: ' + type);

		return null;
	}


};




// ----------------------
module.exports = helpers;