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

var entryHandlers = {
	first: function (first) {
		this.first = require(first.path);
	},

	index: function (index) {
		this.index = require(index.path);
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
			 │	set only if not set yet.
			 │	this makes 'verbs' overriden-able by a specific verb entry.
			 │  'all' is an exception because it's actually an 'index' and not stored in ctrl.verbs.
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