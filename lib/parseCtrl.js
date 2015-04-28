var ary           = require('./utils/ary');
var objLib        = require('./utils/objLib');
var entryHandlers = require('./entryHandlers');

var RESERVEDNAMES  = [
	'index',
	'first',
	'verbs',
	'all',
	'get',
	'post',
	'put',
	'delete',
	'noverb',
	'last'
];

function isReserved (word) {
	return ary.has(RESERVEDNAMES, word);
}

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

	objLib.forIn(folderMap.entries, function (name, mapObj) {
		var isFile, key;

		/* Deal Breaker */ if (name[0] === '_') {return;} // ignore preceding '_'

		isFile  = (mapObj.type === 1);
		key     = (isFile)? removeExt(name) : name;
		key     = key.toLowerCase();

		if (isReserved(key)) {
			entryHandlers[key](folderMap, ctrlObj);
		}
		else if (isFile){
			ctrlObj.methods[key] = require(mapObj.path);
		}
		else {
			ctrlObj.subCtrls[key] = parseCtrl(mapObj, ctrlObj);
		}
	}); 

	return ctrlObj;
}

// ---------------------------------
module.exports = parseCtrl;