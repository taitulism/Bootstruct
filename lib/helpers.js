'use strict';


var helpers = {


	/*
	  ┌────────────────────────────────────────────────
	  │ returns lowerCased extension-less entryname.
	 */
	normalizeEntryName: function (entryName, isFile) {
		var name = entryName.toLowerCase();

		return (isFile) ? helpers.removeExt(name) : name;
	},


	/*
	  ┌─────────────────────────
	  │ removes file extension
	 */
	removeExt: function (entry) {
		var lastDot = entry.lastIndexOf('.');

		return entry.substr(0, lastDot);
	},


	/*
	  ┌──────────────────────────────────────────────────
	  │ validate a require(path) returns a function
	  │ returns: module | null (valid|invalid)
	 */
	tryReqFn: function (path) {
		var req = require(path);

		if (typeof req !== 'function') {
			console.log('Bootstruct Error: ' + path);
			console.log('    This entry is expected to export a single function. Got: ' + typeof req);

			return null;
		}
		return req;
	},


	/*
	  ┌──────────────────────────────────────────
	  │ validate a require(path) returns an object
	  │ returns: module | null (valid|invalid)
	 */
	tryReqObj: function (path) {
		var req  = require(path);
		var type = typeof req;

		if (type !== 'object' || Array.isArray(req)) {
			if (type == 'object') type = 'array';

			console.log('Bootstruct Error: ' + path);
			console.log('    This entry is expected to export an object. Got: ' + type);

			return null;
		}
		return req;
	}


};




// ----------------------
module.exports = helpers;