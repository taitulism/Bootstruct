'use strict';


/*
  ┌──────────────────────────────────────────
  │ accepts a full url and returns an array
  │
  │ ignores qryStr
  │	merges repeating slashes
  │	trim preceding & trailing slashes
  │	split by /
  │
 */
module.exports = function (url) {
	// split by ? and take the first part
	let path = url.split('?')[0];

	// replace multi slashes with one
	path = path.replace(/\/{2,}/g, '/');

	// remove preceding slash
	path = path.substr(1);

	// remove trailing slash
	const len = path.length;

	if (path.charAt(len - 1) === '/') {
		path = path.substring(0, len - 1);
	}

	return path.split('/');
};
