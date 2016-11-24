'use strict';

const error = require('../../errors');
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
		const isFile = entryMap.type;
		const name   = normalizeEntryName(key, isFile);

		if (shouldBeIgnored(global, key, name, isFile)) return;

		// if hook exists
		if (ctrlHooks[name]) {
			ctrlHooks[name].call(ctrl, entryMap);
		}
		else if (isFile || entryMap.entries._METHOD) {
			ctrl.methods[name]      = require(entryMap.path);
			ctrl.methods[name].path = entryMap.path;
		}
		else {
			ctrl.subCtrls[name] = entryMap;
		}
	});

	checkDuplicates(ctrl);
};


// checks method/sub_ctrl duplicates (same entry name)
function checkDuplicates (ctrl) {
	const methods  = Object.keys(ctrl.methods);
	const subCtrls = Object.keys(ctrl.subCtrls);

	methods.forEach((method) => {
		if (subCtrls.includes(method)) {
			return error.fileAndFolderShareName(method, ctrl.folderMap.path);
		}
	});
}
