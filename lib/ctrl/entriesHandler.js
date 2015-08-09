'use strict';

var forIn = require('../utils/forIn');

var entryHandlers = {
	first: function (first) {
		this.first = require(first.path);
	},

	index: function (index) {
		this.index = require(index.path);
	},

	beforeverb: function (index) {
		if (!this.index) {
			this.index = require(index.path);
		}
	},

	before_verb: function (index) {
		if (!this.index) {
			this.index = require(index.path);
		}
	},

	'before-verb': function (index) {
		if (!this.index) {
			this.index = require(index.path);
		}
	},

	all: function (all) {
		if (!this.index) {
			this.index = require(all.path);
		}
	},

	verbs: function (verbs) {
		var self = this;

		forIn(verbs.entries, function (verbName, verbMap) {
			verbName = normalizeEntryName(verbName, verbMap.type);

			 /*
			 |	set only if not set yet.
			 |	this makes 'verbs' overriden-able by a specific verb entry.
			 |  'all' is an exception because it's actually an 'index' and not stored in ctrl.verbs.
			*/
			if (!self[verbName] && !self.verbs[verbName]) {
				entryHandlers[verbName.toLowerCase()].call(self, verbMap);
			}
		});
	},

	get: function (get) {
		this.verbs.get = require(get.path);
	},

	post: function (post) {
		this.verbs.post = require(post.path);
	},

	put: function (put) {
		this.verbs.put = require(put.path);
	},

	delete: function (_delete) {
		this.verbs.delete = require(_delete.path);
	},

	noverb: function (noVerb) {
		this.verbs.noVerb = require(noVerb.path);
	},

	'no-verb': function (noVerb) {
		this.verbs.noVerb = require(noVerb.path);
	},

	no_verb: function (noVerb) {
		this.verbs.noVerb = require(noVerb.path);
	},

	afterverb: function (afterVerb) {
		this.afterVerb = require(afterVerb.path);
	},

	after_verb: function (afterVerb) {
		this.afterVerb = require(afterVerb.path);
	},

	'after-verb': function (afterVerb) {
		this.afterVerb = require(afterVerb.path);
	},

	presub: function (preSub) {
		this.preSub = require(preSub.path);
	},

	pre_sub: function (preSub) {
		this.preSub = require(preSub.path);
	},

	'pre-sub': function (preSub) {
		this.preSub = require(preSub.path);
	},

	postsub: function (postSub) {
		this.postSub = require(postSub.path);
	},

	post_sub: function (postSub) {
		this.postSub = require(postSub.path);
	},

	'post-sub': function (postSub) {
		this.postSub = require(postSub.path);
	},
	
	last: function (last) {
		this.last = require(last.path);
	}
};

/*
  ┌─────────────────────────
  │ removes file extension
 */
function removeExt (entry) {
	var lastDot = entry.lastIndexOf('.');

	return entry.substr(0, lastDot);
}


/*
  ┌────────────────────────────────────────────────
  │ returns lowerCased extension-less entryname.
 */
function normalizeEntryName (entryName, isFile) {
	var name = entryName.toLowerCase();

	return (isFile) ? removeExt(name) : name;
}



// ----------------------------------------------------
module.exports.entryHandlers      = entryHandlers;
module.exports.normalizeEntryName = normalizeEntryName;