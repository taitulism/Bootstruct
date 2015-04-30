var ctrlProto;
var resolve   = require('path').resolve;
var forIn     = require('../utils/forIn');
var parseCtrl = require('../parseCtrl');
var f2j       = require('../utils/f2j');
var IO        = require('./io');


function Ctrl (folder, name, owner) {
	name  = name  || 'RC';
	owner = owner || null;

	//setup
	this.id      = (owner) ? (owner.id+'/'+name) : 'RC';
	this.owner   = owner;
	this.name    = name;
	this.ctrlObj = typeof folder === 'string' ? parseCtrl(f2j(resolve(folder))) : folder;
	this.methods = this.ctrlObj.methods;

	this.init();
}

Ctrl.start = function(folder, name){
	var RC = new Ctrl(folder || 'app', name);
	return function middleware(req, res) {
		return RC.checkIn(new IO(req, res));
	};
};

ctrlProto = Ctrl.prototype;

ctrlProto.init = function() {
	this.setSubCtrls();
	this.setFlags();
};

ctrlProto.setFlags = function() {
	var ctrlObj = this.ctrlObj;
	var verbs   = ctrlObj.verbs;

	this.hasFirst  = (!!ctrlObj.first);
	this.hasAll    = (!!verbs.all);
	this.hasLast   = (!!ctrlObj.last);
};

ctrlProto.setSubCtrls = function(subCtrls) {
	var subCtrls = {};
	var self      = this;

	forIn(this.ctrlObj.subCtrls, function (key, subCtrlObj) {
		subCtrls[key] = new Ctrl(subCtrlObj, key, self);
	});
	
	this.subCtrls = subCtrls;
};

// ----------------------------------------------------------------

ctrlProto.checkIn = function(io) {
	io.ctrl = this;
	this.removeSelfName(io);
	this.profile(io);

	if (this.hasFirst) {
		this.ctrlObj.first.call(this, io);
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
	
	profile = io.getProfile();
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
		profile.value = (this.hasAll)? 0 : 1;
	}

	profile.done = false;

	io.setProfile(profile);
};

ctrlProto.handle = function(io, profile) {
	var next, type, value;

	profile = profile || io.getProfile();

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

		if (!!verb) {
			verb.call(this, io);
		}
		else {
			// console.log('no such verb:', io.VERB);
			io.next();
		}
	}
};

ctrlProto.checkOut = function(io, profile) {
	var last, owner;
	
	profile = profile || io.getProfile();

	if (this.hasLast && !profile.done) {
		profile.done = true;
		this.ctrlObj.last.call(this, io);
	}
	else {
		profile.done = true;
		owner        = this.owner;
		io.ctrl      = owner || this;

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