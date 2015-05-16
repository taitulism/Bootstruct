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
	index: function (index, ctrlObj) {
		ctrlObj.index = require(index.path);
	},

	first: function (first, ctrlObj) {
		ctrlObj.first = require(first.path);
	},

	verbs: function (verbs, ctrlObj) {
		var verbs        = verbs;
		var verbsEntries = verbs.entries;

		forIn(verbs.entries, function (verbName, verbMap) {
			if (verbMap.type === 1) {
				// -3 remove tail '.js'
				verbName = verbName.substr(0, verbName.length-3);
			}

			// verbs is low priority so set only if empty.
			// could be overriden
			if (!ctrlObj.verbs[verbName]) {
				ctrlObj.verbs[verbName] = require(verbMap.path);
			}
		});
	},

	all: function (all, ctrlObj) {
		ctrlObj.verbs.all = require(all.path);
	},

	get: function (get, ctrlObj) {
		ctrlObj.verbs.get = require(get.path);
	},

	post: function (post, ctrlObj) {
		ctrlObj.verbs.post = require(post.path);
	},

	put: function (put, ctrlObj) {
		ctrlObj.verbs.put = require(put.path);
	},

	delete: function (_delete, ctrlObj) {
		ctrlObj.verbs.delete = require(_delete.path);
	},

	noverb: function (noverb, ctrlObj) {
		ctrlObj.verbs.noVerb = require(noverb.path);
	},
	
	last: function (last, ctrlObj) {
		ctrlObj.last = require(last.path);
	}
};


// ----------------------------
module.exports = entryHandlers;