'use strict';

/*
	code layout
	===========
	private methods:
		parseFolderMap - on init
		setupChains    - on init
		removeSelfName - on request (checkIn)
		isTarget       - on request (checkIn)
		runVerb        - called with ctx:  this = ctrl
		runSub         - called with ctx:  this = ctrl


	constructor (exported)

	exposed API (constructor.prototype):
		checkIn
		next
		checkOut

 */

var CtrlProto;
var forIn          = require('../utils/forIn');
var entriesHandler = require('./entriesHandler');
var handlers       = entriesHandler.handlers;
var normalize      = entriesHandler.normalizeEntryName;

var hasOwn = Object.prototype.hasOwnProperty;

//  !isEmpty
var hasProps = function (obj) {
	var key;

    for (key in obj) { if ( hasOwn.call(obj, key) ) { 
    	return true; 
    }}

    return false;
};


//-----------------
// private methods
//-----------------

// get called on init
/*
  ┌─────────────────────────────────────────
  │	the main ctrl init function.
  │	this method gets a folder-map obj and sets the ctrl with its different props and
  │ functionalities.
  │ forEach entry in the folder:
  │ 	ignore _
  │		handle if has an entryHandler
  │		  or 
  │     set as a ctrl's method/subCtrl
 */
function parseFolderMap (ctrl, folderMap) {
	var ctrlEntries = folderMap.entries;

	forIn(ctrlEntries, function (key, entryMap) {
		var isFile, name;

		/* Deal Breaker */ if (key.charAt(0) === '_') {return;} // ignore preceding '_'

		isFile = entryMap.type;

		name = normalize(key, isFile);

		// if such entryHandler exists
		if (hasOwn.call(handlers, name)) {
			handlers[name].call(ctrl, ctrlEntries[key]);
		}
		else if (isFile){
			ctrl.methods[name] = require(entryMap.path);
			ctrl.subKeys.push(name);
		}
		else {
			ctrl.subCtrls[name] = new Ctrl(entryMap, key, ctrl);
			ctrl.subKeys.push(name);
		}
	}); 
}

// get called on init
function setupChains (ctrl) {
	var subChain    = ctrl.subChain    = [];
	var targetChain = ctrl.targetChain = [];


	// first
	if (ctrl.first) {
		subChain.push(ctrl.first);
		targetChain.push(ctrl.first);
	}

	// target
	if (ctrl.all) {
		targetChain.push(ctrl.all);
	}
	if (hasProps(ctrl.verbs)) {
		targetChain.push(runVerb);
	}

	// subCtrls & methods
	if ((ctrl.subKeys.length > 0)) {
		subChain.push(runSub);
	}

	// last
	if (ctrl.last) {
		subChain.push(ctrl.last);
		targetChain.push(ctrl.last);
	}

	ctrl.targetChainLen = targetChain.length;
	ctrl.subChainLen    = subChain.length;
}

// get called on each request (checkIn)
/*
  ┌─────────────────────────────────────────────────────────────────────
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
function removeSelfName (ctrl, io) {
	var first = io.params[0];

	// if (first == ctrl.name)
	if (first && first.toLowerCase() === ctrl.name.toLowerCase()) {
		
		// remove first
		io.params.shift();
	}
}

// get called on each request (checkIn)
/* 
	based on the next param, is this ctrl is the target ctrl for the current request? 
 */
function isTarget (ctrl, io) {
	var next = io.params[0];

	// if next is in ctrl.subKeys
	if (next && ctrl.subKeys.indexOf(next.toLowerCase()) > -1) {
		return false;
	}

	return true;
}


// ----------------------------------------
// on init: set in targetChain
// on request: called with .call(ctrl, io)
// ----------------------------------------
function runVerb (io) {
	var verb = this.verbs[io.method];

	if (verb) {
		verb.call(this, io);
	}
	else {
		this.next(io);
	}
}

// ----------------------------------------
// on init: set in targetChain
// on request: called with .call(ctrl, io)
// ----------------------------------------
function runSub (io) {
	var next = io.params[0];

	if (next) {

		// (next = subCtrl)?
		if (hasOwn.call(this.subCtrls, next)) {
			this.subCtrls[next].checkIn(io);
		}

		// (next = method)?
		else if (hasOwn.call(this.methods, next)){
			this.methods[next].call(this, io);
		}

		// todo: shared method?
	}
}




// ==========================================
//  Ctrl Constructor & Constructor.prototype
// ==========================================
function Ctrl (folderMap, name, parent) {
	parent = parent || null;

	// meta
	this.id        = (parent) ? (parent.id+'/'+name) : 'RC';
	this.parent    = parent;
	this.name      = name;
	this.folderMap = folderMap;

	// subCtrls & methods
	this.subKeys = [];

	// methods
	this.first    = null;
	this.all      = null;
	this.verbs    = {};
	this.noVerb   = {};
	this.subCtrls = {};
	this.methods  = {};
	this.last     = null;

	// init
	parseFolderMap(this, folderMap);

	setupChains(this);
}

CtrlProto = Ctrl.prototype;


/*
  ┌──────────────────────────────────────────────────
  │ remove self name from io.params
  │ profile io
  │ run first in chain
 */
CtrlProto.checkIn = function(io) {
	removeSelfName(this, io);

	// create profile
	io._profiles[this.id] = {
		idx      : 0,
		isTarget : isTarget(this, io)
	};

	this.next(io);
};


/*
  ┌──────────────────────────────────────────────────
  │ called by io.next()
  │ runs the next fn in chain, based on the profile
 */
CtrlProto.next = function(io, profile) {
	var i, isTarget, chain;
	
	// set this as the current handling ctrl
	io._ctrl = this;

	// get profile
	profile = profile || io._profiles[this.id];

	// is target?
	isTarget = (profile.isTarget);
	
	// get corresponding chain
	chain = (isTarget) ? this.targetChain : this.subChain;
	
	i = profile.idx++;

	// if there's more in the chain to run - run it.
	if (i < chain.length) {
		chain[i].call(this, io);
		return;
	}
	
	this.checkOut(io);
};


/*
  ┌──────────────────────────────────────────────────
  │ call parent next or end response (RC)
 */
CtrlProto.checkOut = function(io) {
	var parent = this.parent;

	if (parent) {
		parent.next(io);
	}
	else { // RC ends response
		io.res.end();
	}

	// todo: think. is it right for the RC to always end the response?
};




// -------------------
module.exports = Ctrl;