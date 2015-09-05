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
  │             {mappedObj},
  │             {mappedObj},
  │             {mappedObj}
  │         }
  │     };
  │ 
  │ return_example = {
  │		path : 'C:\\bootstruct\\www',
  │		entries : {
  │			'first.js' : {
  │				path : 'C:\\bootstruct\\www\\first.js',
  │				type : 1
  │			},
  │			foo : {
  │				path : 'C:\\bootstruct\\www\\foo',
  │				type : 0,
  │				entries : {
  │					'first.js' : {
  │						path : 'C:\\bootstruct\\www\\foo\\first.js',
  │						type : 1
  │					},
  │					'last.js' : {
  │						path : 'C:\\bootstruct\\www\\foo\\last.js',
  │						type : 1
  │					},
  │					verbs : {
  │						path : 'Cbootstruct\\www\\foo\\verbs',
  │						entries : [Object],
  │						type : 0
  │					}
  │				}
  │			},
  │			'get.js' : {
  │				path : 'F:\\Google Drive\\Code\\Javascript\\Node\\_tests\\bootstruct\\www\\get.js',
  │				type : 1
  │			},
  │			'last.js' : {
  │				path : 'F:\\Google Drive\\Code\\Javascript\\Node\\_tests\\bootstruct\\www\\last.js',
  │				type : 1
  │			}
  │		}
  │	};
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
