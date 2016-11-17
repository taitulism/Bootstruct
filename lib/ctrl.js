'use strict';

const debugFNs = require('./debug');
const error    = require('./errors');

const {
	FOLDER,
	PARENT_CHAIN_INDEX,
	TARGET_CHAIN_INDEX,
	METHOD_CHAIN_INDEX,
} = require('./CONSTANTS');

const {
	normalizeEntryName,
	shouldBeIgnored,
	isFunction,
	isEmpty,
	forIn,
	f2j
} = require('./utils');

/*
 ┌───────────────────────────────────────────
 | forEach entry in the folder (controller):
 |   ignore?
 |   handle if has an entryHandler
 |     or
 |   set as a ctrl's method/subCtrl
*/
function parseFolderMap (ctrl) {
	const global   = ctrl.global;
	const handlers = global.webRoot_entryHandlers;

	forIn(ctrl.folderMap.entries, (key, entryMap) => {
		const isFile = entryMap.type;
		const name   = normalizeEntryName(key, isFile);

		if (shouldBeIgnored(global, key, name, isFile)) return;

		// if such entryHandler exists
		if (handlers[name]) {
			handlers[name].call(ctrl, entryMap);
		}
		else if (isFile || entryMap.entries._METHOD) {
			ctrl.methods[name] = require(entryMap.path);
		}
		else {
			ctrl.subCtrls[name] = entryMap;
		}
	});

	checkDuplicates(ctrl);
}


function getLoweredFirstParam (io) {
	const firstParam = io.params[0];

	if (!firstParam) return null;

	return firstParam.toLowerCase();
}


function removeCachedModule (path) {
	const mod = require.cache[path];

	if (mod) {
		mod.children.forEach((child) => {
			removeCachedModule(child.id);
		});

		delete require.cache[path];
	}
}


 /*
 | check method/sub_ctrl with the same name
*/
function checkDuplicates (ctrl) {
	const methods  = Object.keys(ctrl.methods);
	const subCtrls = Object.keys(ctrl.subCtrls);

	methods.forEach((method) => {
		if (subCtrls.includes(method)) {
			return error.fileAndFolderShareName(method, ctrl.folderMap.path);
		}
	});
}


const has = {
	verbs (ctrl) {
		return !isEmpty(ctrl.verbs);
	},

	methods (ctrl) {
		let sharedMethods;

		const ownMethods = !isEmpty(ctrl.methods);

		if (ctrl.global.shared_methods) {
			sharedMethods = !isEmpty(ctrl.global.shared_methods);
		}

		return ownMethods || sharedMethods;
	},

	subCtrls (ctrl) {
		let sharedCtrls;

		const ownCtrls = !isEmpty(ctrl.subCtrls);

		if (ctrl.global.shared_ctrls) {
			sharedCtrls = !isEmpty(ctrl.global.shared_ctrls);
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
const run = {
	verb (io) {
		const reqMethod = io.req.method.toLowerCase();
		const verbFn = this.verbs[reqMethod];

		if (isFunction(verbFn)) {
			verbFn.apply(this, io._params);
		}
		else if (isFunction(this.noVerb)) {
			this.noVerb(...io._params);
		}
		else {
			this.next(io);
		}
	},

	method (io) {
		const next   = getLoweredFirstParam(io);
		const method = this.methods[next];

		if (isFunction(method)) {
			io.removeFirstParam();

			method.apply(this, io._params);
		}
	},

	subCtrl (io) {
		const next = getLoweredFirstParam(io);
		const subCtrl = this.subCtrls[next];

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
	let buildID = '';

	// is RC? id = '/'
	if (!ctrl.name) return '/';

	// RC's direct child - avoid double slashes
	if (ctrl.parent && ctrl.parent.name) buildID += ctrl.parent.id;

	// all
	buildID += `/${ctrl.name}`;

	return buildID; 
}


/*
  ┌──────────────────────────────────────────────────────────────
  │ delegated means that when "noVerb" exists in a ctrl, all of 
  │ its sub-ctrls will get it too (inherit behavior)
  │ unless they have a "noVerb" of their own.
 */
function delegateNoVerb (ctrl) {
	// if doesn't own: take from parent
	if (!ctrl.noVerb && ctrl.parent) {
		ctrl.noVerb = ctrl.parent.noVerb;
	}
}


/*
  ┌────────────────────────────────────────────────────────────────
  │ examples:
  │     0. parentChain = [$in, runSub, $out]
  │     1. targetChain = [$in, runVerb, $out]
  │     2. methodChain = [$in, runMethod, $out]
  │
  │ "setupChains" fn creates an array of 3 chains (3 arrays) of 
  │ methods to run for each case.
  │ this.chains = [[...],[...],[...]];
  │
 */
function setupChains (ctrl) {
	const targetChain = [];
	const methodChain = [];
	const parentChain = [];

	const $in = ctrl.in;

	if ($in) {
		targetChain.push($in);
		methodChain.push($in);
		parentChain.push($in);
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

	const $out = ctrl.out;

	if ($out) {
		targetChain.push($out);
		methodChain.push($out);
		parentChain.push($out);
	}

	// 0: parentChain
	// 1: targetChain
	// 2: methodChain
	ctrl.chains = [parentChain, targetChain, methodChain];
}


function initSubCtrls (ctrl) {
	const subCtrls = ctrl.subCtrls;

	forIn(subCtrls, (name, subCtrlMap) => {
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
	const first = getLoweredFirstParam(io);

	if (first && first === ctrl.name) {
		io.removeFirstParam();
	}
}


// ---------------------------
module.exports = function (debug) {
	function Ctrl (name, folderMap, parent, global) {
		this.name      = name;
		this.folderMap = folderMap;
		this.parent    = parent;
		this.global    = global || parent.global;
		this.id        = setID(this);

		this.verbs    = Object.create(null);
		this.methods  = Object.create(this.global.shared_methods || null);
		this.subCtrls = Object.create(this.global.shared_ctrls   || null);

		// TODO: register
		// this.global.ctrls[this.id] = this;

		this.init();
	}


	Ctrl.prototype = {
		constructor: Ctrl,

		name      : null,
		folderMap : null,
		parent    : null,
		global    : null,
		id        : null,
		verbs     : null,
		noVerb    : null,
		methods   : null,
		subCtrls  : null,
		chains    : null,

		init (reMap) {
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

		reMap () {
			// remove the cached required modules from Node's cache
			forIn(this.folderMap.entries, (name, map) => {
				const lowered = name.toLowerCase();

				if (lowered === 'verbs' || lowered === 'verbs.js') {

					if (map.type === FOLDER) {
						forIn(map.entries, (name2, map2) => {
							removeCachedModule(map2.path);
						});
					}

					this.verbs = Object.create(null);
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
		checkIn (io) {
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
		getChainIndex (io) {
			let next = getLoweredFirstParam(io);

			if (next) {
				next = next.toLowerCase();

				if (this.methods[next]) {
					return METHOD_CHAIN_INDEX;
				}
				else if (this.subCtrls[next]) {
					return PARENT_CHAIN_INDEX;
				}

				return TARGET_CHAIN_INDEX;
			}

			return TARGET_CHAIN_INDEX;
		},

		next (io) {
			// set current handling ctrl
			io.ctrl = this;

			// get ctrl profile
			const profile = io._profiles[this.id];

			const i = profile.idx++;

			// is target? 0: sub, 1: target, 2: method
			const chainIndex = (profile.chainIndex);

			// get corresponding chain
			const chain = this.chains[chainIndex]; 

			// if there's more in the chain to run - run it. else - checkOut
			if (chain[i]) {
				chain[i].apply(this, io._params);
			}
			else {
				this.checkOut(io);
			}
		},

		checkOut (io) {
			if (this.name) {
				this.parent.next(io);
			}
			else {
				io.exit(this.global);
			}
		}
	};

	if (debug) {
		Ctrl.prototype.checkIn = debugFNs.checkIn;
		Ctrl.prototype.next    = debugFNs.next;
	}

	return Ctrl;
};
