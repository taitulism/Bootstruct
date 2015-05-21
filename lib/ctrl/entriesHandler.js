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

var forIn = require('../utils/forIn');

var hasOwn = Object.hasOwnProperty;

function removeExt (entry) {
	var lastDot = entry.lastIndexOf('.');

	return entry.substr(0, lastDot);
}


module.exports.normalizeEntryName = function (entryName, isFile) {
	var name = entryName.toLowerCase();

	return (isFile) ? removeExt(name) : name;
};

module.exports.handlers = {
	index: function (index) {
		this.index = require(index.path);
	},

	first: function (first) {
		this.ns[0] = require(first.path);
	},

	/* todo: "verbs" handler currently supports only a folder entry */
	verbs: function (verbs) {
		var self = this;

		forIn(verbs.entries, function (verbName, verbMap) {
			if (verbMap.type === 1) {
				// -3 remove tail '.js'
				verbName = verbName.substr(0, verbName.length-3);
			}

			// set the verb only if not set yet.
			// this makes verbs[verbName] overriden-able by a specific verb entry
			if (!hasOwn.call(self.target, verbName)) {
				self.target[verbName] = require(verbMap.path);
			}
		});
	},

	all: function (all) {
		this.target.all = require(all.path);
	},

	get: function (get) {
		this.target.get = require(get.path);
	},

	post: function (post) {
		this.target.post = require(post.path);
	},

	put: function (put) {
		this.target.put = require(put.path);
	},

	delete: function (_delete) {
		this.target.delete = require(_delete.path);
	},

	noverb: function (noverb) {
		this.target.noVerb = require(noverb.path);
	},
	
	last: function (last) {
		this.ns[1] = require(last.path);
	}
};