'use strict';

var fs            = require('fs');
var path          = require('path');
var fsReadDirSync = fs.readdirSync;
var resolve       = path.resolve;
var statSync      = fs.statSync;


/*
  ┌─────────────────────────────────────────────────────────────────────────────
  │ args:
  │ 		folderPath [string] - a resolved path to an existing folder.
  │ 
  │ returns:
  │ 		mappedObj [obj] - folder mappings json obj.
  │ 
  │     mappedObj = {
  │         path: 'absolute/path/to/entry',
  │         type: 0|1,  // folder|file
  │         entries: {
  │             entryName1: {mappedObj},
  │             entryName2: {mappedObj},
  │             entryName3: {mappedObj}
  │         }
  │     };
  │
 */
var f2j = function (_path) {
	var folderObj = {
		path    :_path, 
		type    : 0,
		entries :{}
	};

	var entries = fsReadDirSync(resolve(_path));

	entries.forEach(function (entryName) {
		var newObj;
		var resolved  = resolve(_path, entryName);
		var entryStat = statSync(resolved);
		var isFile    = entryStat.isFile();

		if (isFile) {
			newObj = {
				path: resolved,
				type: 1
			};
		}
		else {
			newObj = f2j(resolved);
		}

		folderObj.entries[entryName] = newObj;
	});

	return folderObj;
};



// ------------------
module.exports = f2j;
