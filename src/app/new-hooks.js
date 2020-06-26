/* eslint-disable camelcase */

const error = require('../errors');
const {FILE, FOLDER} = require('../constants');
const {tryRequireFn, tryRequireObj, getFn} = require('../utils/try-require');
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
	ignore (ignoreHook) {
		ignoreHook = ignoreHook.index || ignoreHook;

		if (typeof ignoreHook === 'string') {
			addToIgnoreList(this, ignoreHook);
		}
		else if (Array.isArray(ignoreHook)) {
			ignoreHook.forEach((item) => {
				if (typeof item === 'string') {
					addToIgnoreList(this, item);
				}
				else {
					throw error.ignoreItemIsNotAString(item);
				}
			});
		}
		else {
			throw error.ignoreItemIsNotAString(ignoreHook);
		}
	},

	io_init (initHook) {
		initHook = initHook.index || initHook;

		if (initHook && typeof initHook == 'function') {
			// check function's arguments count
			if (initHook.length === 0) {
				throw error.expectedFunctionArgument();
			}

			this.hasInitHook = true;
			this.IO.prototype.init = initHook.index || initHook;
		}
		else {
			throw error.ioInitExpectedAFunction(new Error('io_init hook should be a function'));
		}
	},

	io_exit (exitHook) {
		exitHook = exitHook.index || exitHook;

		if (exitHook && typeof exitHook == 'function') {
			this.IO.prototype.exit = exitHook.index || exitHook;
		}
		else {
			throw error.ioExitExpectedAFunction(new Error('exitHook hook should be a function'));
		}
	},

	io_proto (protoHook) {
		const ioProto = this.IO.prototype;

		extend(ioProto, protoHook.index || protoHook);
	},

	ctrl_proto (protoHook) {
		const ctrlProto = this.Ctrl.prototype;

		extend(ctrlProto, protoHook);
	},

	ctrl_hooks (userHooks) {
		const ctrlHooks = this.ctrlHooks;

		extend(ctrlHooks, userHooks);
	},

	shared_methods (userMethods) {
		const sharedMethods = Object.create(null);

		this.shared_methods = extend(sharedMethods, userMethods);
	},

	shared_ctrls (userCtrls) {
		console.log(2222, userCtrls);

		const shared_ctrls = Object.create(null);

		forIn(userCtrls, (ctrlName, ctrlObj) => {
			ctrlName = normalizeEntryName(ctrlName, false);

			shared_ctrls[ctrlName] = new this.Ctrl(ctrlName, ctrlObj, null, this);
			shared_ctrls[ctrlName].isSharedCtrl = true;
		});

		this.shared_ctrls = shared_ctrls;
	},
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

function extend (target, extensions) {
	forIn(extensions, (key, val) => {
		if (typeof target[key] == 'undefined') {
			target[key] = val.index || val;
		}
	});

	return target;
}


 /*
 | copy from one obj to another
 | optional function validation: copy only if value is a function)
*/
function extend2 (objName, obj, extObj, functionsOnly) {
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
