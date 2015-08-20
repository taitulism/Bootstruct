'use strict';


/*
  ┌────────────────────────────────────────────────
  │ returns lowerCased extension-less entryname.
 */
function normalizeEntryName (entryName, isFile) {
	var name = entryName.toLowerCase();

	return (isFile) ? removeExt(name) : name;
}



/*
  ┌─────────────────────────
  │ removes file extension
 */
function removeExt (entry) {
	var lastDot = entry.lastIndexOf('.');

	return entry.substr(0, lastDot);
}



function tryReqFn (path) {
	var req = require(path);

	if (typeof req !== 'function') {
		console.log('Bootstruct Error: ' + path);
		console.log('    This entry is expected to export a single function. Got: ' + typeof req);

		return null;
	}
	return req;
}



function tryReqObj (path) {
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




// ----------------------------------------------------
module.exports.normalizeEntryName = normalizeEntryName;
module.exports.tryReqFn           = tryReqFn;
module.exports.tryReqObj          = tryReqObj;