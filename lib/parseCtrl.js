'use strict';

var forIn         = require('./utils/forIn');
var entryHandlers = require('./entryHandlers');

function removeExt (entry) {
	var lastDot = entry.lastIndexOf('.');

	return entry.substr(0, lastDot);
}

function parseCtrl (folderMap, owner) {
	var ctrlObj = {
		owner     : owner || null,
		path      : folderMap.path,
		folderMap : folderMap,
		subCtrls  : {},
		methods   : {},
		verbs     : {all: null}
	};

	forIn(folderMap.entries, function (key, mapObj) {
		var isFile, name, hasOwn;

		/* Deal Breaker */ if (key.charAt(0) === '_') {return;} // ignore preceding '_'

		isFile = (mapObj.type === 1);
		name   = (isFile) ? removeExt(key) : key;
		name   = name.toLowerCase();

		hasOwn = Object.hasOwnProperty.call(entryHandlers, name);

		if (hasOwn) {
			entryHandlers[name](folderMap.entries[key], ctrlObj);
		}
		else if (isFile){
			ctrlObj.methods[name] = require(mapObj.path);
		}
		else {
			ctrlObj.subCtrls[name] = parseCtrl(mapObj, ctrlObj);
		}
	}); 

	return ctrlObj;
}

// ---------------------------------
module.exports = parseCtrl;