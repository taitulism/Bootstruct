'use strict';

const error = require('../errors');

const {
	normalizeEntryName,
	shouldBeIgnored,
	isFunction,
	isEmpty,
	forIn,
} = require('../utils');

module.exports = {
    setID,
    parseFolderMap,
    delegateNoVerb,
    setupChains,
    initSubCtrls,
    removeCachedModule,
    getLoweredFirstParam,
    removeSelfName
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
 ┌───────────────────────────────────────────
 | forEach entry in the folder (controller):
 |   ignore?
 |   handle if has an entryHandler
 |     or
 |   set as a ctrl's method/subCtrl
*/
function parseFolderMap (ctrl) {
	const global    = ctrl.global;
	const ctrlHooks = global.hooks.ctrl;

	forIn(ctrl.folderMap.entries, (key, entryMap) => {
		const isFile = entryMap.type;
		const name   = normalizeEntryName(key, isFile);

		if (shouldBeIgnored(global, key, name, isFile)) return;

		// if hook exists
		if (ctrlHooks[name]) {
			ctrlHooks[name].call(ctrl, entryMap);
		}
		else if (isFile || entryMap.entries._METHOD) {
			ctrl.methods[name]      = require(entryMap.path);
			ctrl.methods[name].path = entryMap.path;
		}
		else {
			ctrl.subCtrls[name] = entryMap;
		}
	});

	checkDuplicates(ctrl);
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


function removeCachedModule (path) {
	const mod = require.cache[path];

	if (mod) {
		mod.children.forEach((child) => {
			removeCachedModule(child.id);
		});

		delete require.cache[path];
	}
}


function getLoweredFirstParam (io) {
	const firstParam = io.params[0];

	if (!firstParam) return null;

	return firstParam.toLowerCase();
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
