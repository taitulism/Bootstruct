'use strict';

var ctrlProto;
var forIn          = require('../utils/forIn');
var entriesHandler = require('./entriesHandler');
var handlers       = entriesHandler.handlers;
var normalize      = entriesHandler.normalizeEntryName;

var hasOwn = Object.hasOwnProperty;

//-----------------------------------------------
// Ctrl private methods. called with: this = ctrl
//-----------------------------------------------

/*─────────────────────────────────────────────────────────────────────
 │ each ctrl that gets the io, removes its name from io.params array.
 │ it's name is always the first item.
 │ 
 │ io.params is the url path array.
 │ its different items represent ctrl names (or url params).
 │ 
 │ example:
 │ 		url:  /aaa/bbb/ccc
 │ 			io.params = ['aaa','bbb','ccc']
 │
 │		on aaa-ctrl check-in:
 │ 			io.params =       ['bbb','ccc']
*/
function removeSelfName (io) {
	var first = io.params[0];

	// if (first == this.name)
	if (first && first.toLowerCase() === this.name.toLowerCase()) {
		
		// remove first
		io.params.shift();
	}
}


/*───────────────────────────────────────────────────────────────────────────
  │	the .profile() method (profile as a verb, not a noun) sets the 
  │ ctrl next action with a current io: subCtrl, method or target (run verbs)
 */
function profile (io) {
	var param, next, subCtrl, method;
	
	// create profile
	var profile = io._profiles[this.id] = {
		type  : null,
		value : null,
		done  : false
	};

	param = io.params[0];
	next  = param && param.toLowerCase();

	if (next) {
		subCtrl = this.subCtrls[next];
		method  = this.methods [next];

		if (subCtrl) {
			profile.type  = 'subCtrl';
			profile.value = subCtrl;
			return;
		}
		
		if (method) {
			profile.type  = 'method';
			profile.value = method;
			return;
		}
	}
	else { // target
		profile.type  = 'target';
		profile.value = (this.verbs.all)? 0 : 1;
	}
}


/*──────────────────────────────
  │	ctrl call this when is target
  │	nextVal = 0|1|2
  │		0 - all
  │		1 - verb
  │		2 - done
 */
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


/*─────────────────────────────────────────────────────────────────────────────────────────
  │	the main ctrl init function.
  │	this method gets a folder-map obj and sets the ctrl with its different props and
  │ functionalities.
  │ forEach entry in the folder:
  │ 	ignore _
  │		handle if has an entryHandler
  │		  or 
  │     set as a ctrl's method/subCtrl
 */
function parseFolderMap (folderMap) {
	var self = this;
	var ctrlEntries = folderMap.entries;

	forIn(ctrlEntries, function (key, entryMap) {
		var isFile, name;

		/* Deal Breaker */ if (key.charAt(0) === '_') {return;} // ignore preceding '_'

		isFile = (entryMap.type === 1);

		name = normalize(key, isFile);

		// if such entryHandler exists
		if (hasOwn.call(handlers, name)) {
			handlers[name].call(self, ctrlEntries[key]);
		}
		else if (isFile){
			self.methods[name] = require(entryMap.path);
		}
		else {
			self.subCtrls[name] = new Ctrl(entryMap, key, self);
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

// ================
//  Ctrl.prototype
// ================
ctrlProto = Ctrl.prototype;

/*┌──────────────────────────────────────────────────
  │ remove self name from io.params
  │ profile io
  │ run first or handle
 */
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


/*┌──────────────────────────────────────────────────
  │ called by io.next()
  │ reads io current profile and chooses what's next
 */
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


/*┌──────────────────────────────────────────────────
  │ run last or check-out to parent ctrl
 */
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