'use strict';

var ioProto;
var path = require('path');
var url  = require('url');

function IO (req, res) {
	var self   = this;
	var method = req.method;

	this.req      = req;
	this.res      = res;
	this.profiles = {};
	this.method   = method.toLowerCase();
	this.VERB     = method;
	
	this.parseUrl(this);
}

ioProto = IO.prototype;

ioProto.parseUrl = function () {
	var split, len, lastChar, lastPart, lastPartSplit;

	var urlObj   = this.urlObj = url.parse(this.req.url, true);
	var pathname = urlObj.pathname;

	len      = pathname.length;
	lastChar = pathname[len-1];

	// remove trailing slash
	lastChar = (lastChar === '/') ? len-2 : len-1;
	pathname = pathname.substr(1, lastChar);

	split = pathname.split('/');

	// set isFile by last part
	lastPart      = split[split.length - 1];
	lastPartSplit = lastPart.split('.');

	if (lastPartSplit.length > 1) {
		urlObj.isFile = true;
	}

	urlObj.split = split;

	// io.params starts as a copy of url path split
	this.params = split.slice(0);
};

ioProto.getProfile = function(ctrlID) {
	ctrlID = ctrlID || this.ctrl.id;
	
	return this.profiles[ctrlID] || {};
};

ioProto.setProfile = function(profile, ctrlID) {
	ctrlID = ctrlID || this.ctrl.id;
	
	this.profiles[ctrlID] = profile;
};

ioProto.next = function() {
	this.ctrl.handle(this);
};


// -----------------
module.exports = IO;