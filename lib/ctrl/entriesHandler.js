'use strict';

/*
	code layout
	===========
	private method:
		removeExt - removes file extension ('file.ext' => 'file')
	

	exported method:
		normalizeEntryName


	exported object: 	
		entryHandlers = {
			index
			first
			verbs
			all
			get
			post
			put
			delete
			noverb
			last
		}
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

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

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var forIn = require('../utils/forIn');

var hasOwn = Object.prototype.hasOwnProperty;

/*
  ┌─────────────────────────
  │ removes file extension
 */
function removeExt (entry) {
	var lastDot = entry.lastIndexOf('.');

	return entry.substr(0, lastDot);
}


/*
  ┌──────────────────────────────────────────────
  │ returns lowerCased extension-less entryname
 */
module.exports.normalizeEntryName = function (entryName, isFile) {
	var name = entryName.toLowerCase();

	return (isFile) ? removeExt(name) : name;
};

module.exports.handlers = {
	index: function (index) {
		this.index = require(index.path);
	},

	first: function (first) {
		this.first = require(first.path);
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
			if (verbName === 'all' || verbName === 'noVerb') {
				if (!self[verbName]) {
					self[verbName] = require(verbMap.path);
				}
			}
			else {
				if (!hasOwn.call(self.verbs, verbName)) {
					self.verbs[verbName] = require(verbMap.path);
				}
			}
		});
	},

	all: function (all) {
		this.all = require(all.path);
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
		this.noVerb = require(noverb.path);
	},
	
	last: function (last) {
		this.last = require(last.path);
	}
};