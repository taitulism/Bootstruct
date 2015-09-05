'use strict';


var url   = require('url');
var forIn = require('./utils/forIn');

var hasOwn = Object.prototype.hasOwnProperty;



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
function splitPath (url) {
	var len;

	// split by ? and take the first part
	var path = url.split('?')[0];

	// replace multi slashes with one
	path = path.replace(/\/{2,}/g, '/');

	// remove preceding slash
	path = path.substr(1);

	// remove trailing slash
	len = path.length;

	if (path.charAt(len - 1) == '/') {
		path = path.substring(0, len - 1);
	}

	return path.split('/');
}



// ---------------------------
module.exports = function () {
	// ================
	//  IO Constructor
	// ================
	function IO (req, res) {
		var self   = this;
		var method = req.method;

		this._profiles = {};
		this.req       = req;
		this.res       = res;
		this.params    = splitPath(req.url);
	}

	IO.prototype = { constructor: IO,
		init      : null,
		_profiles : null,
		req       : null,
		res       : null,
		params    : null,
		next: function() {
			this._ctrl.next(this);
		}
	};

	return IO;
};
