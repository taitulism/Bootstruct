'use strict';

var ctrlProto;
var resolve   = require('path').resolve;
var forIn     = require('../utils/forIn');
var parseCtrl = require('../parseCtrl');
var f2j       = require('../utils/f2j');
var IO        = require('./io');


function Ctrl (folder, name, owner) {
	name  = name  || 'RC';
	owner = owner || null;

	this.id      = (owner) ? (owner.id+'/'+name) : 'RC';
	this.owner   = owner;
	this.name    = name;
	this.ctrlObj = this.setCtrlObj(folder);

	this.setSubCtrls();
}

Ctrl.start = function(ctrlFolder, ctrlName){
	var RC;
	
	// default root folder name is 'app'
	ctrlFolder = ctrlFolder || 'app';

	RC = new Ctrl(ctrlFolder, ctrlName);
	
	return function middleware (req, res) {
		var io = new IO(req, res);

		return RC.checkIn(io);
	};
};

ctrlProto = Ctrl.prototype;

ctrlProto.setCtrlObj = function (folder) {
	var resolvedFolder, mappedFolder;

	if (typeof folder === 'string') {
		resolvedFolder = resolve(folder);
		mappedFolder   = f2j(resolvedFolder);

		return parseCtrl(mappedFolder);
	}

	return folder;
};

ctrlProto.setSubCtrls = function(subCtrls) {
	var self     = this;
	var subCtrls = {};

	forIn(this.ctrlObj.subCtrls, function (key, subCtrlObj) {
		subCtrls[key] = new Ctrl(subCtrlObj, key, self);
	});
	
	this.subCtrls = subCtrls;
};

// on init methods
// ---------------------------------------------------------------------
// on request methods

ctrlProto.checkIn = function(io) {
	var first = this.ctrlObj.first;

	io._ctrl = this;

	this.removeSelfName(io);
	this.profile(io);

	if (first) {
		first.call(this, io);
	}
	else {
		this.handle(io);
	}

	return io;
};

ctrlProto.removeSelfName = function(io) {
	var params = io.params;
	var next   = params[0];

	if (next && next.toLowerCase() === this.name.toLowerCase()) {
		params    = params.slice(1);
		io.params = params;
	}
};

ctrlProto.profile = function(io) {
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
		this.runVerbs(io, profile, value);
	}
};

ctrlProto.runVerbs = function(io, profile, nextVal) {
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


// -------------------
module.exports = Ctrl;