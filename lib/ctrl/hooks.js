'use strict';

const {FILE, FOLDER} = require('../constants');
const {tryRequireFn, tryRequireObj} = require('../utils/try-require');
const {
	normalizeEntryName,
	forIn,
	isFunction,
} = require('../utils');


const DONT_REMOVE_EXT = false;

const ctrlHooks = module.exports = {
	_in (entryMap) {
		this.in      = tryRequireFn(entryMap.path);
		this.in.path = entryMap.path;
	},
	index (entryMap) {
		this.index      = tryRequireFn(entryMap.path);
		this.index.path = entryMap.path;
	},
	_before_verb (entryMap) {
		this.index      = tryRequireFn(entryMap.path);
		this.index.path = entryMap.path;
	},
	'_before-verb' (entryMap) {
		this.index      = tryRequireFn(entryMap.path);
		this.index.path = entryMap.path;
	},
	_get (entryMap) {
		this.verbs.get      = tryRequireFn(entryMap.path);
		this.verbs.get.path = entryMap.path;
	},
	_post (entryMap) {
		this.verbs.post      = tryRequireFn(entryMap.path);
		this.verbs.post.path = entryMap.path;
	},
	_put (entryMap) {
		this.verbs.put      = tryRequireFn(entryMap.path);
		this.verbs.put.path = entryMap.path;
	},
	_delete (entryMap) {
		this.verbs.delete      = tryRequireFn(entryMap.path);
		this.verbs.delete.path = entryMap.path;
	},
	'_no-verb' (entryMap) {
		this.noVerb      = tryRequireFn(entryMap.path);
		this.noVerb.path = entryMap.path;
	},
	_no_verb (entryMap) {
		this.noVerb      = tryRequireFn(entryMap.path);
		this.noVerb.path = entryMap.path;
	},
	_after_verb (entryMap) {
		this.afterVerb      = tryRequireFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},
	'_after-verb' (entryMap) {
		this.afterVerb      = tryRequireFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},
	_pre_method (entryMap) {
		this.preMethod      = tryRequireFn(entryMap.path);
		this.preMethod.path = entryMap.path;
	},
	'_pre-method' (entryMap) {
		this.preMethod      = tryRequireFn(entryMap.path);
		this.preMethod.path = entryMap.path;
	},
	_post_method (entryMap) {
		this.postMethod      = tryRequireFn(entryMap.path);
		this.postMethod.path = entryMap.path;
	},
	'_post-method' (entryMap) {
		this.postMethod      = tryRequireFn(entryMap.path);
		this.postMethod.path = entryMap.path;
	},
	_pre_sub (entryMap) {
		this.preSub      = tryRequireFn(entryMap.path);
		this.preSub.path = entryMap.path;
	},
	'_pre-sub' (entryMap) {
		this.preSub      = tryRequireFn(entryMap.path);
		this.preSub.path = entryMap.path;
	},
	_post_sub (entryMap) {
		this.postSub      = tryRequireFn(entryMap.path);
		this.postSub.path = entryMap.path;
	},
	'_post-sub' (entryMap) {
		this.postSub      = tryRequireFn(entryMap.path);
		this.postSub.path = entryMap.path;
	},
	_out (entryMap) {
		this.out      = tryRequireFn(entryMap.path);
		this.out.path = entryMap.path;
	},
	_verbs (entryMap) {
		if (entryMap.type === FOLDER) {
			forIn(entryMap.entries, (verbName, verbMap) => {
				verbName = normalizeEntryName(verbName, verbMap.type);

				const [isVerbOk, isNoVerbOk] = validateVerbName(this, verbName);

				if (isVerbOk || isNoVerbOk) {
					verbName = remove$(verbName);
					ctrlHooks[`_${verbName}`].call(this, verbMap);
				}
			});
		}
		else if (entryMap.type === FILE) {
			const verbsObj = tryRequireObj(entryMap.path);

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
	if (verb[0] === '_') {
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
