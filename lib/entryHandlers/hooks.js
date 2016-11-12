'use strict';

const error = require('../errors');
const utils = require('../utils');

const normalizeEntryName = utils.normalizeEntryName;
const forIn              = utils.forIn;
const tryRequire         = utils.tryRequire;

const tryReqFn  = tryRequire.fn;
const tryReqObj = tryRequire.obj;

const {
	TYPE_FN,
	FILE,
	FOLDER
} = require('../CONSTANTS');


// exported later
const entryHandlers = {
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
		handleEntry('io_proto', entryMap, this.io_proto);
	},

	ctrl_proto (entryMap) {
		handleEntry('ctrl_proto', entryMap, this.ctrl_proto);
	},

	entry_handlers (entryMap) {
		handleEntry('entry_handlers', entryMap, this.webRoot_entryHandlers, TYPE_FN);
	},

	shared_methods (entryMap) {
		const tempObj = Object.create(null);

		this.shared_methods = handleEntry('entry_handlers', entryMap, tempObj, TYPE_FN);
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
 | takes an entry (file or folder)
 | require it.
 | validate it's an object {name:method} pairs (or other type than fn)
*/
function handleEntry (handlerName, entryMap, obj, typeFn) {
	// mod_exp = module.exports
	if (entryMap.type === FILE) {
		const mod_exp = tryReqObj(entryMap.path);

		if (mod_exp) {
			extend(handlerName, obj, mod_exp, typeFn);
		}
	}
	else { // folder
		forIn(entryMap.entries, (entryName, subEntryMap) => {
			let sub_mod_exp;

			if (subEntryMap.type === FOLDER) { // sub folder
				if (hasIndex(subEntryMap)) {
					sub_mod_exp = tryReqFn(subEntryMap.path);
				}
			}
			else { // sub file
				sub_mod_exp = tryReqFn(subEntryMap.path);
			}


			if (sub_mod_exp) { // is function
				entryName = normalizeEntryName(entryName);

				trySetObjKey(handlerName, obj, entryName, sub_mod_exp);
			}

		});
	}

	return obj;
}


 /*
 | copy from one obj to another
 | optional function validation: copy only if value is a function)
*/
function extend (objName, obj, extObj, typeFn) {
	forIn(extObj, (key, val) => {
		if (typeFn) {
			if (typeof val === 'function') {
				trySetObjKey(objName, obj, key, val);
			}
			else {
				return error.hookFunctionExpected(objName, key);
			}
		}
		else {
			trySetObjKey(objName, obj, key, val);
		}
	});
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
	if (!entryMap.type && !entryMap.entries['index.js']) {
		return error.expectingAnIndexFile(entryMap.path);
	}

	return true;
}


// ---------------------------
module.exports = function () {
	return Object.create(entryHandlers);
};
