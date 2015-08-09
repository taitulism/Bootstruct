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
var forIn              = require('../utils/forIn');
var entriesHandler     = require('./entriesHandler');
var entryHandlers      = entriesHandler.entryHandlers;
var normalizeEntryName = entriesHandler.normalizeEntryName;

var hasOwn = Object.prototype.hasOwnProperty;

//  !isEmpty
var hasProps = function (obj) {
	var key;

    for (key in obj) { if ( hasOwn.call(obj, key) ) { 
    	return true; 
    }}

    return false;
};


// both called with: .call(ctrl, io) from chain
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
		var verbs = this.verbs;
		var verb  = verbs[io.req.method.toLowerCase()];

		if (verb) {
			verb.call(this, io);
		}
		else if (verbs.noVerb) {
			verbs.noVerb.call(this, io);
		}
		else {
			this.next(io);
		}
	}
};


/*
  │ because ctrl.verbs also contain 'noVerb'
 */
function hasVerbs (ctrl) {
	var verbs = ctrl.verbs;

	if (verbs.get || verbs.post || verbs.put || verbs.delete){
		return true;
	}

	return false;
}


function hasSubCtrls (ctrl) {
	return ctrl.subKeys.length > 0;
}


/*
  ┌───────────────────────────────────
  │ id is unique, name isn't.
  │ examples:
  │     id:   '//foo', '//foo/bar', '//foo/bar/foo'
  │     name: 'foo'  , 'bar'      , 'foo'
 */
function setMetaProps (ctrl, name, parent) {
	// RC stands for the Root Controller
	if (!parent) { // RC
		ctrl.RC     = ctrl;
		ctrl.isRoot = true;
		ctrl.id     = '/';
	}
	else {
		ctrl.RC     = parent.RC;
		ctrl.isRoot = false;
		ctrl.id     = parent.id + '/' + name;
	}
}


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

		// normalizeEntryName = lowerCase, remove extension
		name = normalizeEntryName(key, isFile);

		// if such entryHandler exists
		if (hasOwn.call(entryHandlers, name)) {
			entryHandlers[name].call(ctrl, entryMap);
		}
		else {
			ctrl.subCtrls[name] = (isFile)? require(entryMap.path) : entryMap;
			ctrl.subKeys.push(name);
		}
	}); 
}

/*
  ┌──────────────────────────────────────────────────────────────────────────────────────────
  │ delegated means when exists in a ctrl, all of its sub-ctrl will get it too (inheritance)
 */
function delegateNoVerb (ctrl) {
	var verbs = ctrl.verbs;

	// if doesn't own: take from parent
	if (!verbs.noVerb && !ctrl.isRoot) {
		verbs.noVerb = ctrl.parent.verbs.noVerb;
	}
}

// runs on init
/*
  ┌────────────────────────────────────────────────────────────────────────────────────────────
  │ Controllers can be used in 2 ways: as target or not
  │ so they can have 2 different chains of methods, 1 for each case.
  │
  │ examples:
  │     0. parentChain = [first, runSub, last]
  │     1. targetChain = [first, index, runVerb, last]
  │
  │ "setupChains" fn creates an array of 2 chains (2 arrays) of methods to run in both cases.
  │
  │ ends with:
  │     this.chains = [parentChain, targetChain];
  │
 */
function setupChains (ctrl) {
	var parentChain = [];
	var targetChain = [];


	// first
	if (ctrl.first) {
		parentChain.push(ctrl.first);
		targetChain.push(ctrl.first);
	}

	// target
	if (ctrl.index) {
		targetChain.push(ctrl.index);
	}
	if (hasVerbs(ctrl)) {
		targetChain.push(run.verb);
	}

	if (ctrl.afterVerb) {
		targetChain.push(ctrl.afterVerb);
	}

	// sub
	if (hasSubCtrls(ctrl)) {
		if (ctrl.preSub) {
			parentChain.push(ctrl.preSub);
		}

		parentChain.push(run.sub);

		if (ctrl.postSub) {
			parentChain.push(ctrl.postSub);
		}
	}

	// last
	if (ctrl.last) {
		parentChain.push(ctrl.last);
		targetChain.push(ctrl.last);
	}

	// 0: parentChain
	// 1: targetChain
	ctrl.chains = [parentChain, targetChain];
}


function initSubCtrls (ctrl) {
	var subCtrls = ctrl.subCtrls;

	forIn(subCtrls, function (name, subCtrlMap) {
		if (typeof subCtrlMap != 'function') {
			subCtrls[name] = new Ctrl(subCtrlMap, name, ctrl);
		}
	});
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
	if (first && first.toLowerCase() === ctrl.name) {

		// remove first
		io.params.shift();
	}
}





// ==========================================
//  Ctrl Constructor & Constructor.prototype
// ==========================================
function Ctrl (folderMap, name, parent) {
	// defaults
	name   = name   || '/'
	parent = parent || null;

	// meta
	this.name      = name;
	this.parent    = parent;
	this.folderMap = folderMap;

	// subCtrls & methods
	this.subKeys = [];

	// methods
	this.first     = null;
	this.index     = null;
	this.afterVerb = null;
	this.preSub    = null;
	this.postSub   = null;
	this.last      = null;
	this.verbs     = Object.create(null);
	this.subCtrls  = Object.create(null);

	// init
	setMetaProps(this, name, parent);

	parseFolderMap(this, folderMap);

	delegateNoVerb(this);

	setupChains(this);

	initSubCtrls(this);
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
	if (!this.isRoot) {
		this.parent.next(io);
	}
	else { // RC ends response
		io.res.end();
	}

	 /*
	 | Think: Is it right for the RC to always end the response?
	 |
	 | This makes Bootstruct a closed app and unable to pass the request/response to an external middleware.
	 | instead of ending the response, consider calling "next" (that must be passed on Bootstruct creation)
	*/
};




// -------------------
module.exports = Ctrl;