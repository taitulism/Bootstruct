'use strict';

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




var has = {
	verbs: function hasVerbs (ctrl) {
		 /*
		 | because ctrl.verbs also contain 'noVerb'
		*/
		var verbs = ctrl.verbs;

		if (verbs.get || verbs.post || verbs.put || verbs.delete){
			return true;
		}

		return false;
	},

	methods: function hasMethods (ctrl) {
		return Object.keys(ctrl.methods).length > 0;
	},

	subCtrls: function hasSubCtrls (ctrl) {
		return Object.keys(ctrl.subCtrls).length > 0;
	}
};




/*
  ┌─────────────────────────────────────────────────────────────────────
  │ 	run = {
  │		.verb()    - on request (in chain)
  │		.method()  - on request (in chain)
  │		.subCtrl() - on request (in chain)
  │	}
  │	all 3 are being pushed to chains and called with: .call(ctrl, io)
 */
var run = {
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
	},

	method: function (io) {
		var method;
		var next = io.params[0];

		method = this.methods[next.toLowerCase()];

		method && method.call(this, io);
	},

	subCtrl: function  (io) {
		var subCtrl;
		var next = io.params[0];

		subCtrl = this.subCtrls[next.toLowerCase()];

		subCtrl && subCtrl.checkIn(io);
	},
};




function hasMethods (ctrl) {
	return Object.keys(ctrl.methods).length > 0;
}




function hasSubCtrls (ctrl) {
	return Object.keys(ctrl.subCtrls).length > 0;
}




/*
 ┌────────────────────────────────────────────────
 │ id is unique, name isn't.
 │ examples:
 │     name: 'foo'  │ 'bar'      │ 'foo'
 │     id:   '/foo' │ '/foo/bar' │ '/foo/bar/foo'
*/
function setID (ctrl, name, parent) {
	var id = '';

	/* Deal Breaker */ if (!parent) {return '/';}

	(parent.id !== '/') && (id += parent.id);

	return id + '/' + name;
}




/*
 ┌─────────────────────────────────────────
 │ this method gets a folder-map obj and sets the ctrl with its different props and
 │ functionalities.
 │ forEach entry in the folder:
 │   ignore _
 │   handle if has an entryHandler
 │     or 
 │   set as a ctrl's method/subCtrl
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
			if (isFile) {
				ctrl.methods[name] = require(entryMap.path);
			}
			else {
				ctrl.subCtrls[name] = entryMap;
			}
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
	if (!verbs.noVerb && ctrl.id !== '/') {
		verbs.noVerb = ctrl.parent.verbs.noVerb;
	}
}




/*
  ┌────────────────────────────────────────────────────────────────────────────────────────────
  │ examples:
  │     0. parentChain = [first, runSub, last]
  │     1. targetChain = [first, runVerb, last]
  │     2. methodChain = [first, runMethod, last]
  │
  │ "setupChains" fn creates an array of 3 chains (3 arrays) of methods to run in all cases.
  │ this.chains = [[...],[...],[...]];
  │
 */
function setupChains (ctrl) {
	var targetChain = [];
	var methodChain = [];
	var parentChain = [];


	// first
	if (ctrl.first) {
		targetChain.push(ctrl.first);
		methodChain.push(ctrl.first);
		parentChain.push(ctrl.first);
	}

	// targetChain
	if (ctrl.index) {
		targetChain.push(ctrl.index);
	}

	if (has.verbs(ctrl)) {
		targetChain.push(run.verb);
	}

	if (ctrl.afterVerb) {
		targetChain.push(ctrl.afterVerb);
	}

	// methodChain
	if (has.methods(ctrl)) {
		if (ctrl.preMethod) {
			methodChain.push(ctrl.preMethod);
		}

		methodChain.push(run.method);

		if (ctrl.postMethod) {
			methodChain.push(ctrl.postMethod);
		}
	}

	// parentChain
	if (has.subCtrls(ctrl)) {
		if (ctrl.preSub) {
			parentChain.push(ctrl.preSub);
		}

		parentChain.push(run.subCtrl);

		if (ctrl.postSub) {
			parentChain.push(ctrl.postSub);
		}
	}

	// last
	if (ctrl.last) {
		targetChain.push(ctrl.last);
		methodChain.push(ctrl.last);
		parentChain.push(ctrl.last);
	}

	// 0: parentChain
	// 1: targetChain
	// 2: methodChain
	ctrl.chains = [parentChain, targetChain, methodChain];
}




function initSubCtrls (ctrl) {
	var subCtrls = ctrl.subCtrls;

	forIn(subCtrls, function (name, subCtrlMap) {
		subCtrls[name] = new Ctrl(subCtrlMap, name, ctrl);
	});
}




/*
  ┌──────────────────────────────────────
  │ example:
  │ 	url:  /A/B/C
  │		on "RC" check-in:
  │ 		io.params = ['A','B','C']
  │
  │		on "A" ctrl check-in:
  │ 		io.params = ['B','C']
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
function Ctrl (folderMap, name, parent, app) {
	// meta
	this.folderMap = folderMap;
	this.parent    = parent || null;
	this.app       = app    || parent.app;
	this.name      = name   || 'RC';
	this.id        = setID(this, name, parent);

	// verbs & methods & subCtrls 
	this.verbs    = Object.create(null);
	this.methods  = Object.create(null);
	this.subCtrls = Object.create(null);

	// init
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
		idx        : 0,
		chainIndex : this.getChainIndex(io)
	};

	this.next(io);
};




/*
  ┌────────────────────────────────────────────────────────────────────────────
  │ test on checkIn, if this ctrl is the target ctrl for the current request.
  │ checks if the next param is an existing sub
  │ 
  │ returns 
  │ 	0: parent
  │ 	1: target
  │ 	2: method
 */
CtrlProto.getChainIndex = function (io) {
	var next = io.params[0];

	if (next) {
		next = next.toLowerCase();

		if (this.methods[next]) {
			return 2;
		}
		else if (this.subCtrls[next]) {
			return 0;
		}
		else {
			return 1;
		}
	}

	return 1;
};




/*
  ┌──────────────────────────────────────────────────
  │ called by io.next()
 */
CtrlProto.next = function(io, profile) {
	var i, chainIndex, chain;
	
	// set current handling ctrl
	io._ctrl = this;
	
	// get profile
	profile = profile || io._profiles[this.id];
	
	i = profile.idx++;
	
	// is target? 0: sub, 1: target, 2: method
	chainIndex = (profile.chainIndex);
	
	// get corresponding chain
	chain = this.chains[chainIndex]; 
	
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
	if (this.id !== '/') { // is not RC
		this.parent.next(io);
	}
	else { // RC ends response
		io.res.end();
	}
};




// -------------------
module.exports = Ctrl;