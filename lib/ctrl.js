'use strict';


var forIn    = require('./utils/forIn');
var f2j      = require('./utils/f2j');
var debugFNs = require('./debug');

var normalizeEntryName = require('./helpers').normalizeEntryName;



/*
 ┌───────────────────────────────────────────
 | forEach entry in the folder (controller):
 |   ignore?
 |   handle if has an entryHandler
 |     or
 |   set as a ctrl's method/subCtrl
*/
function parseFolderMap (ctrl) {
	var global   = ctrl.global;
	var handlers = global.webRoot_entryHandlers;

	forIn(ctrl.folderMap.entries, function (key, entryMap) {
		var name;
		var isFile = entryMap.type;

		name = normalizeEntryName(key, isFile);

		/* Deal Breaker */ if ( shouldBeIgnored(global, key, name, isFile) ) return;

		// if such entryHandler exists
		if (handlers[name]) {
			handlers[name].call(ctrl, entryMap);
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

	checkDuplicates(ctrl);
}



function removeCachedModule (path) {
	var mod = require.cache[path];

	if (mod) {
		mod.children.forEach(function (child) {
			removeCachedModule(child.id);
		});

		delete require.cache[path];
	}
}



function shouldBeIgnored (app, name, normalized, isFile) {
	if ( isFile && isNOTjs(name)         ) return true;

	if ( matchStartWith(app, normalized) ) return true;

	if ( isInIgnoreList(app, normalized) ) return true;

	return false;
}



function isNOTjs (name) {
	var lastDot = name.lastIndexOf('.');
	var ext     = name.substr(lastDot + 1);

	return ext.toLowerCase() != 'js';
}



function matchStartWith (app, name) {
	var starter, nameStart, i;
	var starterList    = app.ignoreStartWith;
	var starterListLen = starterList.length;

	for (i = 0; i < starterListLen; i+=1) {
		starter   = starterList[i];
		nameStart = name.substr(0, starter.length);

		if (nameStart === starter) {
			return true;
		}
	}

	return false;
}



function isInIgnoreList (app, name) {
	if (app.ignoreList.length) {
		return ~app.ignoreList.indexOf(name);
	}

	return false;
}


 /*
 | check method/sub_ctrl with the same name
*/
function checkDuplicates (ctrl) {
	var method, i;
	var methods  = Object.keys(ctrl.methods);
	var subCtrls = Object.keys(ctrl.subCtrls);
	var size     = methods.length;

	for (i = 0; i < size; i+=1) {
		method = methods[i];

		if ( ~subCtrls.indexOf(method) ) {
			console.log('Bootstruct Warning:');
			console.log('   You have a controller and a method with the same name ('+ method +') in:' + ctrl.folderMap.path);
		}
	}
}



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
		var sharedMethods;
		
		var ownMethods = (Object.keys (ctrl.methods).length > 0);

		if (ctrl.global.shared_methods) {
			sharedMethods = (Object.keys (ctrl.global.shared_methods).length > 0);
		}
		
		return ownMethods || sharedMethods;
	},

	subCtrls: function hasSubCtrls (ctrl) {
		var sharedCtrls;
		
		var ownCtrls = (Object.keys (ctrl.subCtrls).length > 0);

		if (ctrl.global.shared_ctrls) {
			sharedCtrls = (Object.keys (ctrl.global.shared_ctrls).length > 0);
		}
		
		return ownCtrls || sharedCtrls;
	}
};



/*
  ┌─────────────────────────────────────────────────────────────────────
  │ 	run = {
  │		.verb()    - on request (in chain)
  │		.method()  - on request (in chain)
  │		.subCtrl() - on request (in chain)
  │	}
  │	all 3 are being pushed to chains and called with: .apply(this, io._params)
 */
var run = {
	verb: function verb (io) {
		var verbs = this.verbs;
		var verb  = verbs[io.req.method.toLowerCase()];

		if (verb) {
			verb.apply(this, io._params);
		}
		else if (verbs.noVerb) {
			verbs.noVerb.apply(this, io._params);
		}
		else {
			this.next(io);
		}
	},

	method: function method (io) {
		var next   = io.params[0];
		var method = this.methods[next.toLowerCase()];

		if (method) {
			io.removeFirstParam();

			method.apply(this, io._params);
		}

	},

	subCtrl: function sub_ctrl (io) {
		var subCtrl;
		var next = io.params[0];

		subCtrl = this.subCtrls[next.toLowerCase()];

		if (subCtrl) {
			subCtrl.parent = this;
			subCtrl.checkIn(io);
		} 
	}
};



/*
 ┌────────────────────────────────────────────────
 │ ctrl.id is its parent.id + /name.
 │ id is unique, name isn't.
 │ examples:
 │     id:   '/foo' │ '/foo/bar' │ '/foo/bar/foo'
 │     name: 'foo'  │ 'bar'      │ 'foo'
*/
function setID (ctrl) {
	var buildID = '';

	// is RC? id = '/'
	if (!ctrl.name) return '/';

	// RC's direct child - avoid double slashes
	if (ctrl.parent && ctrl.parent.name) buildID += ctrl.parent.id;

	// all
	buildID += '/' + ctrl.name;

	return buildID; 
}



/*
  ┌──────────────────────────────────────────────────────────────────────────────────────────
  │ delegated means when exists in a ctrl, all of its sub-ctrl will get it too (inheritance)
 */
function delegateNoVerb (ctrl) {
	var verbs = ctrl.verbs;

	// if doesn't own: take from parent
	if (!verbs.noVerb && ctrl.parent) {
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
		// this ctrl is passed as a parent
		subCtrls[name] = new ctrl.constructor(name, subCtrlMap, ctrl);
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

	if (first && first.toLowerCase() === ctrl.name) {
		io.removeFirstParam();
	}
}




// ---------------------------
module.exports = function (debug) {
	// ==========================================
	//  Ctrl Constructor & Constructor.prototype
	// ==========================================
	function Ctrl (name, folderMap, parent, global) {
		// meta
		this.name      = name;
		this.folderMap = folderMap;
		this.parent    = parent;
		this.global    = global || parent.global;
		this.id        = setID(this);

		this.verbs    = Object.create(null);
		this.methods  = Object.create(this.global.shared_methods || null);
		this.subCtrls = Object.create(this.global.shared_ctrls   || null);

		// register
		// this.global.ctrls[this.id] = this;

		this.init();
	}



	Ctrl.prototype = { constructor: Ctrl,
		name      : null,
		folderMap : null,
		parent    : null,
		global    : null,
		id        : null,
		verbs     : null,
		methods   : null,
		subCtrls  : null,
		chains    : null,


		init: function (reMap) {

			if (reMap) {
				this.reMap();
			}

			// parse
			parseFolderMap(this);

			// init
			delegateNoVerb(this);
			setupChains(this);
			initSubCtrls(this);
		},


		reMap: function () {
			var self = this;

			// remove the cached required modules from Node's cache
			forIn(this.folderMap.entries, function (name, map) {
				var lowered = name.toLowerCase();

				if (lowered == 'verbs' || lowered == 'verbs.js') {

					if (map.type === 0) {
						forIn(map.entries, function (name2, map2) {
							removeCachedModule(map2.path);
						});
					}

					self.verbs = Object.create(null);
				}

				removeCachedModule(map.path);
			});

			this.folderMap = f2j(this.folderMap.path);
		},


	    /*
         ┌──────────────────────────────────────────────────
         | remove self name from io.params
         | profile io
         | run first in chain
        */
		checkIn: function (io) {
			(this.name) && removeSelfName(this, io);

			// create profile
			io._profiles[this.id] = {
				idx        : 0,
				chainIndex : this.getChainIndex(io)
			};

			this.next(io);
		},


		/*
		 ┌────────────────────────────────────────────────────────────────────────────
		 | test on checkIn, if this ctrl is the target ctrl for the current request.
		 | checks if the next param is an existing sub
		 |
		 | returns
		 | 	0: parent
		 | 	1: target
		 | 	2: method
		*/
		getChainIndex: function (io) {
			var next = io.params[0];

			if (next) {
				next = next.toLowerCase();

				if (this.methods[next]) {
					return 2; // method-chain
				}
				else if (this.subCtrls[next]) {
					return 0; // parent-chain
				}
				else {
					return 1; // target-chain
				}
			}

			return 1;
		},


		next: function (io) {
			var profile, i, chainIndex, chain;

			// set current handling ctrl
			io._ctrl = this;

			// get ctrl profile
			profile = io._profiles[this.id];

			i = profile.idx++;

			// is target? 0: sub, 1: target, 2: method
			chainIndex = (profile.chainIndex);

			// get corresponding chain
			chain = this.chains[chainIndex]; 

			// if there's more in the chain to run - run it. else - checkOut
			if (chain[i]) {
				chain[i].apply(this, io._params);
			}
			else {
				this.checkOut(io);
			}
		},


	    /*
	     ┌──────────────────────────────────────────────────
	     | call parent next or end response (RC)
	    */
		checkOut: function (io) {
			if (!this.name) { // RC ends response
				io.res.end();
			}
			else {
				this.parent.next(io);
			}
		}
	};

	if (debug) {
		Ctrl.prototype.checkIn = debugFNs.checkIn;
		Ctrl.prototype.next    = debugFNs.next;
	}

	return Ctrl;
};
