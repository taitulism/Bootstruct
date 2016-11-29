'use strict';

const error = require('../../errors');
const FILE = require('../../constants').FILE;

const {
	normalizeEntryName,
	shouldBeIgnored,
    forIn,
} = require('../../utils');


/*
  ┌───────────────────────────────────────────
  | forEach entry in the folder (controller):
  |   ignore?
  |   handle if has an entryHandler
  |     or
  |   set as a ctrl's method/subCtrl
 */
module.exports = function (ctrl) {
	const global    = ctrl.global;
	const ctrlHooks = global.hooks.ctrl;

	forIn(ctrl.folderMap.entries, (key, entryMap) => {
		const isFile = entryMap.type === FILE;
		const name   = normalizeEntryName(key, isFile);

		if (shouldBeIgnored(global, key, name, isFile)) return;

		// if hook exists
		if (ctrlHooks[name]) {
			ctrlHooks[name].call(ctrl, entryMap);
		}
		else if (isFile || entryMap.entries._METHOD) {
			const method = require(entryMap.path);
			const params = extractFnParams(method);

			if (!params) {
				return error.methodsWithNoParams(entryMap.path);
			}

			method.path   = entryMap.path;
			method.params = params;

			ctrl.methods[name] = method;
		}
		else {
			ctrl.subCtrls[name] = entryMap;
		}
	});

	checkDuplicates(ctrl);
};

function extractFnParams (fn) {
	const strFn = fn.toString();

     /*
	 | matches the parens () and their content.
	 | use extra parens for grouping the params and excluding the wrapping parens
	*/
	const fnParamsRgx = /\((.*)\)/;
	const rawParams   = strFn.match(fnParamsRgx);

	if (!rawParams || !rawParams[1]) return false;

	const params = rawParams[1].split(/,\s*/);

	// remove first param (io)
	params.shift();

	return params;
}


// checks method/sub_ctrl duplicates (same entry name)
function checkDuplicates (ctrl) {
	const methods  = Object.keys(ctrl.methods);
	const subCtrls = Object.keys(ctrl.subCtrls);

	methods.forEach((method) => {
		if (subCtrls.includes(method)) {
			return error.fileAndFolderNameCollision(method, ctrl.folderMap.path);
		}
	});
}
