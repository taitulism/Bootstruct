'use strict';

var ctrlProto;
var forIn          = require('../utils/forIn');
var entryHandlers  = require('../entryHandlers');
var resolve        = require('path').resolve;

var hasOwn = Object.hasOwnProperty;

//-------------------------------------------------------------
// private FNs 
//-------------------------------------------------------------

function removeExt (entry) {
	var lastDot = entry.lastIndexOf('.');

	return entry.substr(0, lastDot);
}

function normalizeEntryName (entryName, isFile) {
	var name = entryName.toLowerCase();

	return (isFile) ? removeExt(name) : name;
}

// todo: simplify. use shift not slice.
function removeSelfName (io) {
	var params = io.params;
	var next   = params[0];

	if (next && next.toLowerCase() === this.name.toLowerCase()) {
		params    = params.slice(1);
		io.params = params;
	}
}

function profile (io) {
	var profile, param, next, subCtrl, method;
	
	profile = io._getProfile(this.id);
	param   = io.params[0];
	next    = param && param.toLowerCase();

	subCtrl = this.subCtrls[next];
	method  = this.methods [next];

	if (subCtrl) {
		profile.type  = 'subCtrl';
		profile.value = subCtrl;
	}
	else if (method) {
		profile.type  = 'method';
		profile.value = method;
	}
	else { // target
		profile.type  = 'target';
		profile.value = (this.verbs.all)? 0 : 1;
	}

	profile.done = false;

	io._setProfile(profile);
}

function runVerbs (io, profile, nextVal) {
	var	verb, verbs;

	if (nextVal === 0) { // 0: all
		profile.value = 1;
		this.verbs.all.call(this, io);
	}
	else if (nextVal === 1) { // 1: verb
		profile.value = 2;
		verb = this.verbs[io.method];

		if (verb) {
			verb.call(this, io);
		}
		else {
			// console.log('no such verb:', io.VERB);
			io.next();
		}
	}
}

function parseFolderMap (folderMap) {
	var self = this;

	forIn(folderMap.entries, function (key, entryMap) {
		var isFile, name;

		/* Deal Breaker */ if (key.charAt(0) === '_') {return;} // ignore preceding '_'

		isFile = (entryMap.type === 1);

		name = normalizeEntryName(key, isFile);

		// if such entryHandler exists
		if (hasOwn.call(entryHandlers, name)) {
			entryHandlers[name].call(self, folderMap.entries[key]);
		}
		else if (isFile){
			self.methods[name] = require(entryMap.path);
		}
		else {
			self.subCtrls[name] = new Ctrl (entryMap, key, self);
		}
	}); 
}


// ==================
//  Ctrl Constructor 
// ==================
function Ctrl (folderMap, name, parent) {
	parent = parent || null;

	this.id        = (parent) ? (parent.id+'/'+name) : 'RC';
	this.parent    = parent;
	this.name      = name;
	this.folderMap = folderMap;

	this.subCtrls = {};
	this.methods  = {};
	this.verbs    = {};
	
	parseFolderMap.call(this, folderMap);
}




// ------------------------
ctrlProto = Ctrl.prototype;
// ------------------------




ctrlProto.checkIn = function(io) {
	var first = this.first;

	io._ctrl = this;
	removeSelfName.call(this, io);

	profile.call(this, io);

	if (first) {
		first.call(this, io);
	}
	else {
		this.handle(io);
	}

	return io;
};

ctrlProto.handle = function(io, profile) {
	var next, type, value;

	profile = profile || io._getProfile(this.id);

	type  = profile.type;
	value = profile.value;

	/* Deal Breaker */ if (profile.done || value === 2) {
		this.checkOut(io, profile);
		return;
	}

	if (type === 'subCtrl') {
		value.checkIn(io);
	}
	else if (type === 'method') {
		profile.value = 2;
		io.params.splice(0,1);
		value.call(this, io);
	}
	else if (type === 'target') {
		runVerbs.call(this, io, profile, value);
	}
};

ctrlProto.checkOut = function(io, profile) {
	var parent;
	var last = this.last;

	profile = profile || io._getProfile(this.id);

	if (last && !profile.done) {
		profile.done = true;
		last.call(this, io);
	}
	else {
		profile.done = true;
		parent       = this.parent;
		io._ctrl     = parent || this;

		if (parent) {
			parent.checkOut(io);
		}
		else { // RC
			// todo: think. is it right for the RC to always end the response?
			io.res.end();
		}
		
	}
};




// -------------------
module.exports = Ctrl;