'use strict';


var ioProto;

var url   = require('url');
var forIn = require('./utils/forIn');

var hasOwn = Object.prototype.hasOwnProperty;




// private fn
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

ioProto = IO.prototype;

ioProto.init = null;

ioProto.next = function() {
	this._ctrl.next(this);
};




// ----------------------------
module.exports.proto = ioProto;
module.exports.IO    = IO;
