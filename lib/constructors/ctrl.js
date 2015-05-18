'use strict';

var ctrlProto;
var resolve   = require('path').resolve;
var forIn     = require('../utils/forIn');
var parseCtrl = require('../parseCtrl');
var f2j       = require('../utils/f2j');
var IO        = require('./io');


/* ──────────────────────────────────────────────────────────────────────────────
 │ Bootstruct outer API (exported later)
 │ returns the final middleware function (to be called with: request, response)
*/
function Bootstruct (ctrlFolder) {
	var RC;
	
	// default root folder name is 'app'
	ctrlFolder = ctrlFolder || 'app';

	RC = new Ctrl(ctrlFolder, 'RC');
	
	return function middleware (req, res) {
		var io = new IO(req, res);

		return RC.checkIn(io);
	};
}


//-------------
// private FNs
//-------------
// todo: this returns a folder path (str) or a ctrlObj :\
// 		 RC.ctrlObj is folder path? check this
function setCtrlObj (folder) {
	var resolvedFolder, mappedFolder;

	if (typeof folder === 'string') {
		resolvedFolder = resolve(folder);
		mappedFolder   = f2j(resolvedFolder);

		return parseCtrl(mappedFolder);
	}

	return folder;
}

// todo: this.subCtrls always an obj. (even when empty)
// 		 this makes checking for subctrls easier later (on req)
function setSubCtrls () {
	var self     = this;
	var subCtrls = {};

	forIn(this.ctrlObj.subCtrls, function (key, subCtrlObj) {
		subCtrls[key] = new Ctrl(subCtrlObj, key, self);
	});
	
	this.subCtrls = subCtrls;
}

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
	method  = this.ctrlObj.methods [next];

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
		profile.value = (this.ctrlObj.verbs.all)? 0 : 1;
	}

	profile.done = false;

	io._setProfile(profile);
}

function runVerbs (io, profile, nextVal) {
	var	verb, verbs;

	if (nextVal === 0) { // 0: all
		profile.value = 1;
		this.ctrlObj.verbs.all.call(this, io);
	}
	else if (nextVal === 1) { // 1: verb
		profile.value = 2;
		verb = this.ctrlObj.verbs[io.method];

		if (verb) {
			verb.call(this, io);
		}
		else {
			// console.log('no such verb:', io.VERB);
			io.next();
		}
	}
}


// ==================
//  Ctrl Constructor 
// ==================
function Ctrl (folder, name, owner) {
	name  = name  || 'RC';
	owner = owner || null;

	this.id      = (owner) ? (owner.id+'/'+name) : 'RC';
	this.owner   = owner;
	this.name    = name;
	this.ctrlObj = setCtrlObj.call(this, folder);

	setSubCtrls.call(this);
}

// ------------------------
ctrlProto = Ctrl.prototype;
// ------------------------

ctrlProto.checkIn = function(io) {
	var first = this.ctrlObj.first;

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
	var owner;
	var last = this.ctrlObj.last;
	
	profile = profile || io._getProfile(this.id);

	if (last && !profile.done) {
		profile.done = true;
		last.call(this, io);
	}
	else {
		profile.done = true;
		owner        = this.owner;
		io._ctrl     = owner || this;

		if (owner) {
			owner.checkOut(io);
		}
		else { // RC
			// todo: think. is it right for the RC to always end the response?
			io.res.end();
		}
		
	}
};


// -------------------------
module.exports = Bootstruct;