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

var objLib = require('./utils/objLib');

var entryHandlers = {
	index: function (folderMap, ctrlObj) {
		ctrlObj.index = require(folderMap.entries['index.js'].path);
	},

	first: function (folderMap, ctrlObj) {
		var entries  = folderMap.entries;
		var entryMap = entries['first.js'] || entries.first;
		
		ctrlObj.first = require(entryMap.path);
	},

	verbs: function (folderMap, ctrlObj) {
		var verbs        = folderMap.entries.verbs;
		var verbsEntries = verbs.entries;

		objLib.forIn(verbs.entries, function (verbName, verbMap) {
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

	all: function (folderMap, ctrlObj) {
		var entries  = folderMap.entries;
		var entryMap = entries['all.js'] || entries.all;

		ctrlObj.verbs.all = require(entryMap.path);
	},

	get: function (folderMap, ctrlObj) {
		var entries  = folderMap.entries;
		var entryMap = entries['get.js'] || entries.get;

		ctrlObj.verbs.get = require(entryMap.path);
	},

	post: function (folderMap, ctrlObj) {
		var entries  = folderMap.entries;
		var entryMap = entries['post.js'] || entries.post;

		ctrlObj.verbs.post = require(entryMap.path);
	},

	put: function (folderMap, ctrlObj) {
		var entries  = folderMap.entries;
		var entryMap = entries['put.js'] || entries.put;

		ctrlObj.verbs.put = require(entryMap.path);
	},

	delete: function (folderMap, ctrlObj) {
		var entries  = folderMap.entries;
		var entryMap = entries['delete.js'] || entries.delete;

		ctrlObj.verbs.delete = require(entryMap.path);
	},

	noverb: function (folderMap, ctrlObj) {
		var entries  = folderMap.entries;
		var entryMap = entries['noverb.js'] || entries.noverb;	
		
		ctrlObj.verbs.noVerb = require(entryMap.path);
	},

	last: function (folderMap, ctrlObj) {
		var entries  = folderMap.entries;
		var entryMap = entries['last.js'] || entries.last;

		ctrlObj.last = require(entryMap.path);
	}
};


// ----------------------------
module.exports = entryHandlers;