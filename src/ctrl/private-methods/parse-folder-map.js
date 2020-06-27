const error = require('../../errors');
const {hookNames} = require('../hooks');

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
module.exports = function parseFolderMap (ctrl) {
	const {coreObj, app} = ctrl;
	const {ctrlHooks} = app;

	forIn(coreObj, (key, value) => {
		const name = normalizeEntryName(key, false);

		// if hook exists
		if (ctrlHooks[name]) {
			const hook = ctrlHooks[name].index || ctrlHooks[name];
			hook.call(ctrl, value);
		}
		else if (hookNames.has(key) || shouldBeIgnored(app, name)) return;
		else if (typeof value == 'function') {
			const method = value;
			const params = extractFnParams(method);

			if (!params) throw error.methodsWithNoParams(method);

			method.params = params;
			ctrl.methods[name] = method;
		}
		else {
			ctrl.subCtrls[name] = value;
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
const REGEX_functionParams = /\((.*)\)/u;

function extractFnParams (fn) {
	const fnString = fn.toString();
	const paramsMatches = fnString.match(REGEX_functionParams);

	if (!paramsMatches || !paramsMatches[1]) return false;

	const params = paramsMatches[1].split(/\s*,\s*/u);

	// remove first param (io)
	params.shift();

	return params
		// leave only $params
		.filter(param => param[0] === '$')
		// remove $
		.map(param => param.substr(1));
}
