'use strict';

const fs    = require('fs');
const $path = require('path');

const {FILE, FOLDER} = require('../constants');

const fsReadDirSync = fs.readdirSync;
const statSync      = fs.statSync;
const resolve       = $path.resolve;


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
function f2j (path) {
	const folderObj = {
		path, 
		type: FOLDER,
		entries: {}
	};

	const entries = fsReadDirSync(resolve(path));

	entries.forEach((entryName) => {
		const resolved  = resolve(path, entryName);
		const entryStat = statSync(resolved);
		const isFile    = entryStat.isFile();
		
		let newObj;

		if (isFile) {
			newObj = {
				path: resolved,
				type: FILE
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
