'use strict';

const error = require('../errors');
const {FILE, FOLDER}  = require('../constants');
const {tryRequireFn, tryRequireObj} = require('../utils/try-require');
const {
	normalizeEntryName,
	forIn,
	removeExtension,
} = require('../utils');

function addToIgnoreList (app, ignoreItem) {
	const hooksNames = Object.keys(app.Ctrl.prototype);

	ignoreItem = ignoreItem.toLowerCase();

	if (hooksNames.includes(ignoreItem)) {
		return error.cannotIgnoreReservedEntryName(ignoreItem);
	}

	app.ignoreList.push(ignoreItem);
}

module.exports = {
	ignore (entryMap) {
		if (!hasIndex(entryMap)) return;

		const ignore = require(entryMap.path);

		if (typeof ignore === 'string') {
			addToIgnoreList(this, ignore);
		}
		else if (Array.isArray(ignore)) {
			ignore.forEach((item) => {
				if (typeof item === 'string') {
					addToIgnoreList(this, item);
				}
				else {
					throw error.ignoreItemIsNotAString(item);
				}
			});
		}
		else {
			throw error.ignoreItemIsNotAString(ignore);
		}
	},

	io_init (entryMap) {
		if (!hasIndex(entryMap)) return;

		this.io_init = true;
		
		const customInitFn = tryRequireFn(entryMap.path);

		if (customInitFn) {
			// check function's arguments count
			if (customInitFn.length === 0) {
				throw error.expectedFunctionArgument();
			}
			
			this.IO.prototype.init = customInitFn;
		}
		else {
			throw error.ioInitExpectedAFunction();
		}
	},

	io_exit (entryMap) {
		if (!hasIndex(entryMap)) return;

		const customInitFn = tryRequireFn(entryMap.path);

		if (customInitFn) {
			this.IO.prototype.exit = customInitFn;
		}
		else {
			throw error.ioExitExpectedAFunction();
		}
	},

	io_proto (entryMap) {
		const extending = this.IO.prototype;

		if (entryMap.type === FILE) {
			simpleHookFile('io_proto', entryMap.path, extending);
		}
		else {
			simpleHookFolder('io_proto', entryMap.entries, extending);
		}
	},

	ctrl_proto (entryMap) {
		const extending = this.Ctrl.prototype;

		if (entryMap.type === FILE) {
			simpleHookFile('ctrl_proto', entryMap.path, extending);
		}
		else {
			simpleHookFolder('ctrl_proto', entryMap.entries, extending);
		}
	},

	ctrl_hooks (entryMap) {
		const MUST_BE_A_FUNCTION = true;
		const extending = this.ctrlHooks;

		if (entryMap.type === FILE) {
			simpleHookFile('ctrl_hooks', entryMap.path, extending, MUST_BE_A_FUNCTION);
		}
		else {
			simpleHookFolder('ctrl_hooks', entryMap.entries, extending);
		}
	},

	shared_methods (entryMap) {
		const MUST_BE_A_FUNCTION = true;
		const extending = Object.create(null);

		if (entryMap.type === FILE) {
			this.shared_methods = simpleHookFile('shared_methods', entryMap.path, extending, MUST_BE_A_FUNCTION);
		}
		else {
			this.shared_methods = simpleHookFolder('shared_methods', entryMap.entries, extending);
		}
	},

	shared_ctrls (entryMap) {
		if (entryMap.type !== FOLDER) {
			return error.sharedCtrlExpectedAFolder(entryMap.path);
		}

		const shared_ctrls = Object.create(null);

		forIn(entryMap.entries, (entryName, _entryMap) => {
			entryName = normalizeEntryName(entryName, false);

			shared_ctrls[entryName] = new this.Ctrl(entryName, _entryMap, null, this);
			
			shared_ctrls[entryName].isSharedCtrl = true;
		});

		this.shared_ctrls = shared_ctrls;
	}
};


 /*
 | requires a file
 | validate it's an object {name:method} pairs (or other type than fn)
*/
function simpleHookFile (hookName, hookPath, targetObj, onlyIfFunction) {
	const exportedModule = tryRequireObj(hookPath);

	if (exportedModule) {
		extend(hookName, targetObj, exportedModule, onlyIfFunction);
	}

	return targetObj;
}

function simpleHookFolder (hookName, entryMaps, targetObj) {
	forIn(entryMaps, (entryName, entryMap) => {
		const {type, path} = entryMap;

		let exportedModule;

		if (type === FOLDER) {
			if (hasIndex(entryMap)) {
				exportedModule = tryRequireFn(path);
			}
		}
		else if (type === FILE) {
			exportedModule = tryRequireFn(path);
		}

		if (exportedModule) {
			entryName = removeExtension(entryName);

			trySetObjKey(hookName, targetObj, entryName, exportedModule);
		}
	});

	return targetObj;
}


 /*
 | copy from one obj to another
 | optional function validation: copy only if value is a function)
*/
function extend (objName, obj, extObj, functionsOnly) {
	if (functionsOnly) {
		forIn(extObj, (key, val) => {
			if (typeof val === 'function') {
				trySetObjKey(objName, obj, key, val);
			}
			else {
				return error.hookFunctionExpected(objName, key);
			}
		});
	}
	else {
		forIn(extObj, (key, val) => {
			trySetObjKey(objName, obj, key, val);
		});
	}
}


function trySetObjKey (objName, obj, key, val) {
	if (typeof obj[key] === 'undefined') {
		obj[key] = val;
	}
	else {
		return error.objectKeyAlreadyExists(objName, key);
	}
}


function hasIndex (entryMap) {
	if (entryMap.type === FOLDER && !entryMap.entries['index.js']) {
		return error.expectingAnIndexFile(entryMap.path);
	}

	return true;
}
