'use strict';


const helpers            = require('../helpers');
const normalizeEntryName = helpers.normalizeEntryName;
const tryReqFn           = helpers.tryReqFn;
const tryReqObj          = helpers.tryReqObj;
const forIn              = require('../utils/forIn');

const verbsAry = [
	'get',
	'post',
	'put',
	'delete',
	'noVerb',
	'no-verb',
	'no_verb'
];

const entryHandlers = {
	first (entryMap) {
		this.first      = tryReqFn(entryMap.path);
		this.first.path = entryMap.path;
	},

	index (entryMap) {
		this.index      = tryReqFn(entryMap.path);
		this.index.path = entryMap.path;
	},

	beforeverb (entryMap) {
		this.index      = tryReqFn(entryMap.path);
		this.index.path = entryMap.path;
	},

	before_verb (entryMap) {
		this.index      = tryReqFn(entryMap.path);
		this.index.path = entryMap.path;
	},

	'before-verb' (entryMap) {
		this.index      = tryReqFn(entryMap.path);
		this.index.path = entryMap.path;
	},

	all (entryMap) {
		this.index      = tryReqFn(entryMap.path);
		this.index.path = entryMap.path;
	},

	get (entryMap) {
		this.verbs.get      = tryReqFn(entryMap.path);
		this.verbs.get.path = entryMap.path;
	},

	post (entryMap) {
		this.verbs.post      = tryReqFn(entryMap.path);
		this.verbs.post.path = entryMap.path;
	},

	put (entryMap) {
		this.verbs.put      = tryReqFn(entryMap.path);
		this.verbs.put.path = entryMap.path;
	},

	delete (entryMap) {
		this.verbs.delete      = tryReqFn(entryMap.path);
		this.verbs.delete.path = entryMap.path;
	},

	noverb (entryMap) {
		this.verbs.noVerb      = tryReqFn(entryMap.path);
		this.verbs.noVerb.path = entryMap.path;
	},

	'no-verb' (entryMap) {
		this.verbs.noVerb      = tryReqFn(entryMap.path);
		this.verbs.noVerb.path = entryMap.path;
	},

	no_verb (entryMap) {
		this.verbs.noVerb      = tryReqFn(entryMap.path);
		this.verbs.noVerb.path = entryMap.path;
	},

	afterverb (entryMap) {
		this.afterVerb      = tryReqFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},

	after_verb (entryMap) {
		this.afterVerb      = tryReqFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},

	'after-verb' (entryMap) {
		this.afterVerb      = tryReqFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},

	alldone (entryMap) {
		this.afterVerb      = tryReqFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},

	all_done (entryMap) {
		this.afterVerb      = tryReqFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},

	'all-done' (entryMap) {
		this.afterVerb      = tryReqFn(entryMap.path);
		this.afterVerb.path = entryMap.path;
	},

	premethod (entryMap) {
		this.preMethod      = tryReqFn(entryMap.path);
		this.preMethod.path = entryMap.path;
	},

	pre_method (entryMap) {
		this.preMethod      = tryReqFn(entryMap.path);
		this.preMethod.path = entryMap.path;
	},

	'pre-method' (entryMap) {
		this.preMethod      = tryReqFn(entryMap.path);
		this.preMethod.path = entryMap.path;
	},

	postmethod (entryMap) {
		this.postMethod      = tryReqFn(entryMap.path);
		this.postMethod.path = entryMap.path;
	},

	post_method (entryMap) {
		this.postMethod      = tryReqFn(entryMap.path);
		this.postMethod.path = entryMap.path;
	},

	'post-method' (entryMap) {
		this.postMethod      = tryReqFn(entryMap.path);
		this.postMethod.path = entryMap.path;
	},

	presub (entryMap) {
		this.preSub      = tryReqFn(entryMap.path);
		this.preSub.path = entryMap.path;
	},

	pre_sub (entryMap) {
		this.preSub      = tryReqFn(entryMap.path);
		this.preSub.path = entryMap.path;
	},

	'pre-sub' (entryMap) {
		this.preSub      = tryReqFn(entryMap.path);
		this.preSub.path = entryMap.path;
	},

	postsub (entryMap) {
		this.postSub      = tryReqFn(entryMap.path);
		this.postSub.path = entryMap.path;
	},

	post_sub (entryMap) {
		this.postSub      = tryReqFn(entryMap.path);
		this.postSub.path = entryMap.path;
	},

	'post-sub' (entryMap) {
		this.postSub      = tryReqFn(entryMap.path);
		this.postSub.path = entryMap.path;
	},

	last (entryMap) {
		this.last      = tryReqFn(entryMap.path);
		this.last.path = entryMap.path;
	},

	verbs (entryMap) {
		if (entryMap.type === 0) { // verbs folder
			forIn(entryMap.entries, (verbName, verbMap) => {

				verbName = normalizeEntryName(verbName, verbMap.type);

				if (!this.verbs[verbName] && verbsAry.includes(verbName)) {
					entryHandlers[verbName].call(this, verbMap);
				}
			});
		}
		else { // verbs file
			const verbsObj = tryReqObj(entryMap.path);

			if (verbsObj) {

				forIn(verbsObj, (verbName, fn) => {
					verbName = normalizeEntryName(verbName, false);

					if (!this.verbs[verbName] && verbsAry.includes(verbName)) {
						this.verbs[verbName]      = fn;
						this.verbs[verbName].path = entryMap.path;
					}
				});

			}

		}
	}
};


// ---------------------------
module.exports = function () {
	return Object.create(entryHandlers);
};
