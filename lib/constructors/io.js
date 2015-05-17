'use strict';

var ioProto;
var getExtension = require('path').extname;
var url          = require('url');

function IO (req, res) {
	var self   = this;
	var method = req.method;

	this._profiles = {};
	this.req      = req;
	this.res      = res;
	this.method   = method.toLowerCase();
	this.VERB     = method;
	
	parseUrl(this);
}

function parseUrl (io) {
	var split, len;
	var urlObj   = io.urlObj = url.parse(io.req.url, true);
	var pathname = urlObj.pathname;
	var ext      = getExtension(pathname);

	urlObj.isFile = getExtension(pathname);

	pathname = trimSlashes(pathname);

	split = pathname.split('/');

	urlObj.split = split;

	// io.params starts as a copy of url path split
	io.params = split.slice(0);
}

function trimSlashes (pathname) {
	var lastCharIndexOffset = 1;
	var len = pathname.length;

	if (pathname[len-1] === '/') {
		lastCharIndexOffset = 2;
	}

	return pathname.substr(1, len - lastCharIndexOffset);;
}

ioProto = IO.prototype;

// on init methods
// ---------------------------------------------------------------------
// on request methods

ioProto._getProfile = function(ctrlID) {
	ctrlID = ctrlID || this._ctrl.id;
	
	return this._profiles[ctrlID] || {};
};

ioProto._setProfile = function(profile, ctrlID) {
	ctrlID = ctrlID || this._ctrl.id;
	
	this._profiles[ctrlID] = profile;
};

ioProto.next = function() {
	this._ctrl.handle(this);
};


// -----------------
module.exports = IO;