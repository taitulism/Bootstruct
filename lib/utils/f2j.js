'use strict';

const fs            = require('fs');
const path          = require('path');
const fsReadDirSync = fs.readdirSync;
const resolve       = path.resolve;
const statSync      = fs.statSync;


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
function f2j (_path) {
	const folderObj = {
		path    :_path, 
		type    : 0,
		entries :{}
	};

	const entries = fsReadDirSync(resolve(_path));

	entries.forEach((entryName) => {
		const resolved  = resolve(_path, entryName);
		const entryStat = statSync(resolved);
		const isFile    = entryStat.isFile();
		
		let newObj;

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
}


// ------------------
module.exports = f2j;
