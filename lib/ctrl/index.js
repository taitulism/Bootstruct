'use strict';

/*
	code layout
	===========
	run = {
		.sub()  - on request (in chain)
		.verb() - on request (in chain)
	}
	both being pushed to chains and called with: .call(ctrl, io)

	parseFolderMap() - on init
	setupChains()    - on init
	removeSelfName() - on request (checkIn)

	Constructor (exported)

	exposed API:
	Constructor.prototype = {
		checkIn()
		isTarget()
		next()
		checkOut()
	}

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

var run = {
	sub: function  (io) {
		var subCtrl;
		var next = io.params[0];

		subCtrl = this.subCtrls[next.toLowerCase()];

		if (typeof subCtrl === 'function') { // method
			subCtrl.call(this, io);
		}
		else { // subCtrl
			subCtrl.checkIn(io);
		}
	},

	verb: function (io) {
		var verb = this.verbs[io.req.method.toLowerCase()];

		if (verb) {
			verb.call(this, io);
		}
		else {
			this.next(io);
		}
	}
};


// runs on init
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

		// normalize = lowerCase, remove extension
		name = normalize(key, isFile);

		// if such entryHandler exists
		if (hasOwn.call(handlers, name)) {
			handlers[name].call(ctrl, ctrlEntries[key]);

			return;
		}
		else if (isFile){
			ctrl.subCtrls[name] = require(entryMap.path);
		}
		else { // folder
			ctrl.subCtrls[name] = new Ctrl(entryMap, key, ctrl);
		}

		ctrl.subKeys.push(name);
	}); 
}


// runs on init
/*
  ┌────────────────────────────────────────────────────────────────────────────────────────────
  │ Controllers can be used in 2 ways: as target or not
  │ so they can have 2 different chains of methods, 1 for each case.
  │
  │ examples:
  │     0. subCHain    = [first, runSub, last]
  │     1. targetChain = [first, index, runVerb, last]
  │
  │ "setupChains" fn creates an array of 2 chains (2 arrays) of methods to run in both cases.
  │
  │ ends with:
  │     this.chains = [subChain, targetChain];
  │
 */
function setupChains (ctrl) {
	var subChain    = [];
	var targetChain = [];


	// first
	if (ctrl.first) {
		subChain.push(ctrl.first);
		targetChain.push(ctrl.first);
	}

	// target
	if (ctrl.index) {
		targetChain.push(ctrl.index);
	}
	if (hasProps(ctrl.verbs)) {
		targetChain.push(run.verb);
	}

	// subCtrls or methods
	if (ctrl.subKeys.length > 0) {
		subChain.push(run.sub);
	}

	// last
	if (ctrl.last) {
		subChain.push(ctrl.last);
		targetChain.push(ctrl.last);
	}

	// 0: subChain
	// 1: targetChain
	ctrl.chains = [subChain, targetChain];
}


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
	this.index    = null;
	this.last     = null;
	this.noVerb   = null;
	this.verbs    = {};
	this.subCtrls = {};

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
		isTarget : this.isTarget(io)
	};

	this.next(io);
};


/*
  ┌────────────────────────────────────────────────────────────────────────────
  │ test on checkIn, if this ctrl is the target ctrl for the current request.
  │ checks if the next param is an existing sub
  │ 
  │ returns 
  │ 	0: sub
  │ 	1: target
 */
CtrlProto.isTarget = function (io) {
	var next = io.params[0];

	// if next is in this.subKeys
	if (next && this.subKeys.indexOf(next.toLowerCase()) > -1) {
		return 0;
	}

	return 1;
};


/*
  ┌──────────────────────────────────────────────────
  │ called by io.next()
 */
CtrlProto.next = function(io, profile) {
	var i, isTarget, chain;
	
	
	// set current handling ctrl
	io._ctrl = this;

	
	// get profile
	profile = profile || io._profiles[this.id];

	
	i = profile.idx++;

	
	// is target? 0: sub, 1: target
	isTarget = (profile.isTarget);
	
	
	// get corresponding chain
	chain = this.chains[isTarget]; 

	
	// if there's more in the chain to run - run it. else - checkOut
	if (chain[i]) {
		chain[i].call(this, io);
	}
	else {
		this.checkOut(io);
	}
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