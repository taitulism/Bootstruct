'use strict';

const error = require('../errors');
const utils = require('../utils');

const {FILE, FOLDER} = require('../constants');

const normalizeEntryName = utils.normalizeEntryName;
const forIn              = utils.forIn;
const tryRequire         = utils.tryRequire;
const removeExt          = utils.removeExtension;

const tryReqFn  = tryRequire.fn;
const tryReqObj = tryRequire.obj;

module.exports = {
	ignore (entryMap) {
		if (!hasIndex(entryMap)) return;

		const ignoreList = require(entryMap.path);

		if (typeof ignoreList === 'string') {
			this.addToIgnoreList(ignoreList);
		}
		else if (Array.isArray(ignoreList)) {
			ignoreList.forEach((item) => {
				this.addToIgnoreList(item);
			});
		}
		else {
			return error.expectedAnArrayOfStrings();
		}
	},

	io_init (entryMap) {
		if (!hasIndex(entryMap)) return;

		const customInitFn = tryReqFn(entryMap.path);

		if (customInitFn) {
			// check function's arguments count
			if (customInitFn.length === 0) {
				return error.expectedFunctionArgument();
			}

			this.io_proto.init = customInitFn;
		}
		else {
			return error.ioInitExpectedAFunction();
		}
	},

	io_exit (entryMap) {
		if (!hasIndex(entryMap)) return;

		const customInitFn = tryReqFn(entryMap.path);

		if (customInitFn) {
			this.io_proto.exit = customInitFn;
		}
		else {
			return error.ioExitExpectedAFunction();
		}
	},

	io_proto (entryMap) {
		const extending = this.io_proto;

		if (entryMap.type === FILE) {
			simpleHookFile('io_proto', entryMap.path, extending);
		}
		else {
			simpleHookFolder('io_proto', entryMap.entries, extending);
		}
	},

	ctrl_proto (entryMap) {
		const extending = this.ctrl_proto;

		if (entryMap.type === FILE) {
			simpleHookFile('ctrl_proto', entryMap.path, extending);
		}
		else {
			simpleHookFolder('ctrl_proto', entryMap.entries, extending);
		}
	},

	ctrl_hooks (entryMap) {
		const MUST_BE_A_FUNCTION = true;
		const extending = this.hooks.ctrl;

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
			this.shared_methods = simpleHookFile('ctrl_hooks', entryMap.path, extending, MUST_BE_A_FUNCTION);
		}
		else {
			this.shared_methods = simpleHookFolder('ctrl_hooks', entryMap.entries, extending);
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
		});

		this.shared_ctrls = shared_ctrls;
	}
};


 /*
 | requires a file
 | validate it's an object {name:method} pairs (or other type than fn)
*/
function simpleHookFile (hookName, hookPath, targetObj, onlyIfFunction) {
	const exportedModule = tryReqObj(hookPath);

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
				exportedModule = tryReqFn(path);
			}
		}
		else if (type === FILE) {
			exportedModule = tryReqFn(path);
		}

		if (exportedModule) {
			entryName = removeExt(entryName);

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
