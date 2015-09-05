'use strict';


var helpers            = require('../helpers');
var normalizeEntryName = helpers.normalizeEntryName;
var tryReqFn           = helpers.tryReqFn;
var tryReqObj          = helpers.tryReqObj;
var forIn              = require('../utils/forIn');

var verbsAry = [
	'get',
	'post',
	'put',
	'delete',
	'noVerb',
	'no-verb',
	'no_verb'
];

var entryHandlers = {
	first: function (entryMap) {
		this.first = tryReqFn(entryMap.path);
	},

	index: function (entryMap) {
		this.index = tryReqFn(entryMap.path);
	},

	beforeverb: function (entryMap) {
		this.index = tryReqFn(entryMap.path);
	},

	before_verb: function (entryMap) {
		this.index = tryReqFn(entryMap.path);
	},

	'before-verb': function (entryMap) {
		this.index = tryReqFn(entryMap.path);
	},

	all: function (entryMap) {
		this.index = tryReqFn(entryMap.path);
	},

	get: function (entryMap) {
		this.verbs.get = tryReqFn(entryMap.path);
	},

	post: function (entryMap) {
		this.verbs.post = tryReqFn(entryMap.path);
	},

	put: function (entryMap) {
		this.verbs.put = tryReqFn(entryMap.path);
	},

	delete: function (entryMap) {
		this.verbs.delete = tryReqFn(entryMap.path);
	},

	noverb: function (entryMap) {
		this.verbs.noVerb = tryReqFn(entryMap.path);
	},

	'no-verb': function (entryMap) {
		this.verbs.noVerb = tryReqFn(entryMap.path);
	},

	no_verb: function (entryMap) {
		this.verbs.noVerb = tryReqFn(entryMap.path);
	},

	afterverb: function (entryMap) {
		this.afterVerb = tryReqFn(entryMap.path);
	},

	after_verb: function (entryMap) {
		this.afterVerb = tryReqFn(entryMap.path);
	},

	'after-verb': function (entryMap) {
		this.afterVerb = tryReqFn(entryMap.path);
	},
	
	alldone: function (entryMap) {
		this.afterVerb = tryReqFn(entryMap.path);
	},

	all_done: function (entryMap) {
		this.afterVerb = tryReqFn(entryMap.path);
	},

	'all-done': function (entryMap) {
		this.afterVerb = tryReqFn(entryMap.path);
	},

	premethod: function (entryMap) {
		this.preMethod = tryReqFn(entryMap.path);
	},

	pre_method: function (entryMap) {
		this.preMethod = tryReqFn(entryMap.path);
	},

	'pre-method': function (entryMap) {
		this.preMethod = tryReqFn(entryMap.path);
	},

	postmethod: function (entryMap) {
		this.postMethod = tryReqFn(entryMap.path);
	},

	post_method: function (entryMap) {
		this.postMethod = tryReqFn(entryMap.path);
	},

	'post-method': function (entryMap) {
		this.postMethod = tryReqFn(entryMap.path);
	},

	presub: function (entryMap) {
		this.preSub = tryReqFn(entryMap.path);
	},

	pre_sub: function (entryMap) {
		this.preSub = tryReqFn(entryMap.path);
	},

	'pre-sub': function (entryMap) {
		this.preSub = tryReqFn(entryMap.path);
	},

	postsub: function (entryMap) {
		this.postSub = tryReqFn(entryMap.path);
	},

	post_sub: function (entryMap) {
		this.postSub = tryReqFn(entryMap.path);
	},

	'post-sub': function (entryMap) {
		this.postSub = tryReqFn(entryMap.path);
	},
	
	last: function (entryMap) {
		this.last = tryReqFn(entryMap.path);
	},

	verbs: function (entryMap) {
		var verbsObj;
		
		var self = this;

		if (entryMap.type === 0) { // verbs folder
			forIn(entryMap.entries, function (verbName, verbMap) {

				verbName = normalizeEntryName(verbName, verbMap.type);

				if (!self.verbs[verbName] && ~verbsAry.indexOf(verbName)) {
					entryHandlers[verbName].call(self, verbMap);
				}
			});
		}
		else { // verbs file
			verbsObj = tryReqObj(entryMap.path);
	
			if (verbsObj) {
				
				forIn(verbsObj, function (verbName, fn) {
					verbName = normalizeEntryName(verbName, false);

					if (!self.verbs[verbName] && ~verbsAry.indexOf(verbName)) {
						self.verbs[verbName] = fn;
					}
				});

			}
			
		}
	}
};



// ----------------------------
module.exports = entryHandlers;