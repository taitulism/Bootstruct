'use strict';

var fs       = require('fs');
var path     = require('path');
var entry    = require('../constructors/entry');
var Folder   = entry.folder;
var resolve  = path.resolve;
var statSync = fs.statSync;




 /*─────────────────────────────────────────────────────────────────────────────
 │ args:
 │ 		folderPath [string] - a resolved path to an existing folder.
 │ 
 │ returns:
 │ 		mappedObj [obj] - folder mappings json obj.
 │ 
 │		mappedObj = {
 │			path: 'absolute/path/to/entry',
 │			type: 0|1,  // folder|file
 │			entries: {
 │				{mappedObj},
 │				{mappedObj},
 │				{mappedObj}
 │			}
 │ 		} ;
 │ 
 │ return_example = {
 │		path : 'C:\\bootstruct\\app',
 │		entries : {
 │			'first.js' : {
 │				path : 'C:\\bootstruct\\app\\first.js',
 │				type : 1
 │			},
 │			foo : {
 │				path : 'C:\\bootstruct\\app\\foo',
 │				type : 0,
 │				entries : {
 │					'first.js' : {
 │						path : 'C:\\bootstruct\\app\\foo\\first.js',
 │						type : 1
 │					},
 │					'last.js' : {
 │						path : 'C:\\bootstruct\\app\\foo\\last.js',
 │						type : 1
 │					},
 │					verbs : {
 │						path : 'Cbootstruct\\app\\foo\\verbs',
 │						entries : [Object],
 │						type : 0
 │					}
 │				}
 │			},
 │			'get.js' : {
 │				path : 'F:\\Google Drive\\Code\\Javascript\\Node\\_tests\\bootstruct\\app\\get.js',
 │				type : 1
 │			},
 │			'last.js' : {
 │				path : 'F:\\Google Drive\\Code\\Javascript\\Node\\_tests\\bootstruct\\app\\last.js',
 │				type : 1
 │			}
 │		}
 │	};
 │
*/
var f2j = function (_path) {
	var mappedObj = {path:_path, entries:{}};

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

		mappedObj.entries[entry.toLowerCase()] = newObj;
	});

	return mappedObj;
};


// ------------------
module.exports = f2j;