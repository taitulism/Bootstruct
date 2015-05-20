'use strict';

/* 

	folderMap is the ctrl's folderMap. 
	has .entries which is an obj {}
	keys in this obj are entry names ('verbs', 'all.js') of the ctrl's folder

	Precedence Order:
		1.file
		2.folder

		try the "name.js" file first. if no such file try the "name" folder.
		
		1.[verb] (all, get...)
		2.'verbs'

		when you have a verbs entries (get, post.js etc...) they will have precedence over what's in the "verbs" folder 

*/

var forIn = require('./utils/forIn');

var entryHandlers = {
	index: function (index) {
		this.index = require(index.path);
	},

	first: function (first) {
		this.first = require(first.path);
	},

	verbs: function (verbs) {
		var self = this;

		// verbs is folder only
		var verbsEntries = verbs.entries;

		forIn(verbs.entries, function (verbName, verbMap) {
			if (verbMap.type === 1) {
				// -3 remove tail '.js'
				verbName = verbName.substr(0, verbName.length-3);
			}

			// this makes verbs[verbName] lower priority (than a specific verb entry)
			// so set only if empty.
			if (!self.verbs[verbName]) {
				self.verbs[verbName] = require(verbMap.path);
			}
		});
	},

	all: function (all) {
		this.verbs.all = require(all.path);
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

	noverb: function (noverb) {
		this.verbs.noVerb = require(noverb.path);
	},
	
	last: function (last) {
		this.last = require(last.path);
	}
};


// ----------------------------
module.exports = entryHandlers;