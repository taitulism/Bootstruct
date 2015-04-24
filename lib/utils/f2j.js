var fs       = require('fs');
var path     = require('path');
var entry    = require('../constructors/entry');
var Folder   = entry.folder;
var resolve  = path.resolve;
var statSync = fs.statSync;

var f2j = function (_path) {
	var currentObj = {path:_path, entries:{}};

	Folder(_path).forEach(function (entry, i) {
		var newObj;
		var resolved  = resolve(_path, entry);
		var entryStat = statSync(resolved);
		var isFile    = entryStat.isFile();

		if (isFile) {
			newObj = {
				path: resolved,
				type: 1
			};
		}
		else {
			newObj      = f2j(resolved);
			newObj.type = 0;
		}

		currentObj.entries[entry.toLowerCase()] = newObj;
	});

	return currentObj;
};


// ------------------
module.exports = f2j;