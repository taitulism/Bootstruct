'use strict';

const utils = require('../utils');
const {FILE, FOLDER} = require('../constants');

const normalizeEntryName = utils.normalizeEntryName;
const forIn              = utils.forIn;
const isFunction         = utils.isFunction;
const tryRequire         = utils.tryRequire;

const tryReqFn  = tryRequire.fn;
const tryReqObj = tryRequire.obj;

const DONT_REMOVE_EXT = false;

const entryHandlers = {
	$in (entryMap) {
		this.in      = tryReqFn(entryMap.path);
		this.in.path = entryMap.path;
	},
	index (entryMap) {
		this.index      = tryReqFn(entryMap.path);
		this.index.path = entryMap.path;
	},
	$before_verb (entryMap) {
		this.index      = tryReqFn(entryMap.path);
		this.index.path = entryMap.path;
	},
	'$before-verb' (entryMap) {
		this.index      = tryReqFn(entryMap.path);
		this.index.path = entryMap.path;
	},
	$get (entryMap) {
		this.verbs.get      = tryReqFn(entryMap.path);
		this.verbs.get.path = entryMap.path;
	},
	$post (entryMap) {
		this.verbs.post      = tryReqFn(entryMap.path);
		this.verbs.post.path = entryMap.path;
	},
	$put (entryMap) {
		this.verbs.put      = tryReqFn(entryMap.path);
		this.verbs.put.path = entryMap.path;
	},
	$delete (entryMap) {
		this.verbs.delete      = tryReqFn(entryMap.path);
		this.verbs.delete.path = entryMap.path;
	},
	'$no-verb' (entryMap) {
		this.noVerb      = tryReqFn(entryMap.path);
		this.noVerb.path = entryMap.path;
	},
	$no_verb (entryMap) {
		this.noVerb      = tryReqFn(entryMap.path);
		this.noVerb.path = entryMap.path;
	},
	$after_verb (entryMap) {
		this.afterVerb      = tryReqFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},
	'$after-verb' (entryMap) {
		this.afterVerb      = tryReqFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},
	$pre_method (entryMap) {
		this.preMethod      = tryReqFn(entryMap.path);
		this.preMethod.path = entryMap.path;
	},
	'$pre-method' (entryMap) {
		this.preMethod      = tryReqFn(entryMap.path);
		this.preMethod.path = entryMap.path;
	},
	$post_method (entryMap) {
		this.postMethod      = tryReqFn(entryMap.path);
		this.postMethod.path = entryMap.path;
	},
	'$post-method' (entryMap) {
		this.postMethod      = tryReqFn(entryMap.path);
		this.postMethod.path = entryMap.path;
	},
	$pre_sub (entryMap) {
		this.preSub      = tryReqFn(entryMap.path);
		this.preSub.path = entryMap.path;
	},
	'$pre-sub' (entryMap) {
		this.preSub      = tryReqFn(entryMap.path);
		this.preSub.path = entryMap.path;
	},
	$post_sub (entryMap) {
		this.postSub      = tryReqFn(entryMap.path);
		this.postSub.path = entryMap.path;
	},
	'$post-sub' (entryMap) {
		this.postSub      = tryReqFn(entryMap.path);
		this.postSub.path = entryMap.path;
	},
	$out (entryMap) {
		this.out      = tryReqFn(entryMap.path);
		this.out.path = entryMap.path;
	},
	$verbs (entryMap) {
		if (entryMap.type === FOLDER) {
			forIn(entryMap.entries, (verbName, verbMap) => {
				verbName = normalizeEntryName(verbName, verbMap.type);

				const [isVerbOk, isNoVerbOk] = validateVerbName(this, verbName);

				if (isVerbOk || isNoVerbOk) {
					verbName = remove$(verbName);
					entryHandlers[`$${verbName}`].call(this, verbMap);
				}
			});
		}
		else if (entryMap.type === FILE) {
			const verbsObj = tryReqObj(entryMap.path);

			if (verbsObj) {
				forIn(verbsObj, (verbName, fn) => {
					if (!isFunction(fn)) return;

					verbName = normalizeEntryName(verbName, DONT_REMOVE_EXT);

					const [isVerbOk, isNoVerbOk] = validateVerbName(this, verbName);

					if (isVerbOk) {
						this.verbs[verbName] = fn;
						this.verbs[verbName].path = entryMap.path;
					}
					else if (isNoVerbOk) {
						this.noVerb = fn;
						this.noVerb.path = entryMap.path;
					}
				});
			}
		}
	}
};

function validateVerbName (ctrl, verbName) {
	verbName = remove$(verbName);

	const isVerbOk   = isVerb(verbName) && !ctrl.verbs[verbName];
	const isNoVerbOk = isNoVerb(verbName) && !ctrl.noVerb;
	
	return [isVerbOk, isNoVerbOk];
}

function remove$ (verb) {
	if (verb[0] === '$') {
		verb = verb.substr(1);
	}

	return verb;
}

const supportedVerbs = [
	'get',
	'post',
	'put',
	'delete',
];

const noVerb = [
	'no-verb',
	'no_verb'
];

function isVerb (verb) {
	return supportedVerbs.includes(verb);
}

function isNoVerb (verb) {
	return noVerb.includes(verb);
}


// -------------------------------------
module.exports = function () {
	return Object.create(entryHandlers);
};
