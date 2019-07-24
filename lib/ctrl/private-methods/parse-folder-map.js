'use strict';

const error = require('../../errors');
const FILE = require('../../constants').FILE;

const {
	normalizeEntryName,
	getDuplicatedKeys,
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
	const app       = ctrl.app;
	const ctrlHooks = app.ctrlHooks;

	forIn(ctrl.folderMap.entries, (key, entryMap) => {
		const isFile = entryMap.type === FILE;
		const name   = normalizeEntryName(key, isFile);

		if (shouldBeIgnored(app, key, name, isFile)) return;

		// if hook exists
		if (ctrlHooks[name]) {
			ctrlHooks[name].call(ctrl, entryMap);
		}
		else if (isFile || entryMap.entries._METHOD) {
			const method = require(entryMap.path);
			const params = extractFnParams(method);

			if (!params) {
				throw error.methodsWithNoParams(entryMap.path);
			}

			method.path   = entryMap.path;
			method.params = params;

			ctrl.methods[name] = method;
		}
		else {
			ctrl.subCtrls[name] = entryMap;
		}
	});

	const duplicated = getDuplicatedKeys(ctrl.methods, ctrl.subCtrls);

	if (duplicated.length > 0) {
		throw error.fileAndFolderNameCollision(duplicated, ctrl.folderMap.path);
	}
};

 /*
 | Matches the parens () and their content.
 | use extra parens for grouping the params and excluding the wrapping parens
*/
const REGEX_functionParams = /\((.*)\)/;

function extractFnParams (fn) {
	const fnString = fn.toString();
	const paramsMatches = fnString.match(REGEX_functionParams);

	if (!paramsMatches || !paramsMatches[1]) return false;

	const params = paramsMatches[1].split(/\s*,\s*/);

	// remove first param (io)
	params.shift();

	const $params = params
		// leave only $params
		.filter((param) => param[0] === '$')
		// remove $
        .map((param) => param.substr(1));

	return $params;
}
