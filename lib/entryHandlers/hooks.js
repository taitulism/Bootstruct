'use strict';


const helpers            = require('../helpers');
const tryReqFn           = helpers.tryReqFn;
const tryReqObj          = helpers.tryReqObj;
const normalizeEntryName = helpers.normalizeEntryName;
const forIn              = require('../utils/forIn');


// exported later
const entryHandlers = {
	ignore (entryMap) {
		/* Deal Breaker */ if (!hasIndex(entryMap)) return;

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
			console.log('Bootstruct Error:');
			console.log('   "ignore" hook handler should export an array of strings.');
		}
	},

	io_init (entryMap) {
		/* Deal Breaker */ if (!hasIndex(entryMap)) return;

		const customInitFn = tryReqFn(entryMap.path);

		if (customInitFn) {

			if (customInitFn.length === 0) {
				console.log('Bootstruct Error:');
				console.log('   "io.init" function must handle an argument: "app".');
				console.log('   You should call "app.checkIn(this)" when the function is done.');

				return;
			}

			this.io_proto.init = customInitFn;
		}
		else {
			console.log('Bootstruct Error:');
			console.log('   "io.init" expected to be a function.');
		}
	},

	io_exit (entryMap) {
		/* Deal Breaker */ if (!hasIndex(entryMap)) return;

		const customInitFn = tryReqFn(entryMap.path);

		if (customInitFn) {
			this.io_proto.exit = customInitFn;
		}
		else {
			console.log('Bootstruct Error:');
			console.log('   "io.exit" expected to be a function.');
		}
	},

	io_proto (entryMap) {
		handleEntry('io_proto', entryMap, this.io_proto);
	},

	ctrl_proto (entryMap) {
		handleEntry('ctrl_proto', entryMap, this.ctrl_proto);
	},

	entry_handlers (entryMap) {
		handleEntry('entry_handlers', entryMap, this.webRoot_entryHandlers, 1);
	},

	shared_methods (entryMap) {
		const tempObj = Object.create(null);

		this.shared_methods = handleEntry('entry_handlers', entryMap, tempObj, 1);
	},

	shared_ctrls (entryMap) {
		/* Deal Breaker */ if (entryMap.type !== 0) {
			console.log('Bootstruct Error: "shared_ctrls"');
			console.log('   Controllers must be folders:', entryMap.path);
			return;
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
	if (entryMap.type === 1) { // file
		const mod_exp = tryReqObj(entryMap.path);

		if (mod_exp) {
			extend(handlerName, obj, mod_exp, typeFn);
		}
	}
	else { // folder
		forIn(entryMap.entries, (entryName, subEntryMap) => {
			let sub_mod_exp;

			if (subEntryMap.type === 0) { // sub folder
				if (hasIndex(subEntryMap)) {
					sub_mod_exp = tryReqFn(subEntryMap.path);
				}
			}
			else { // sub file
				sub_mod_exp = tryReqFn(subEntryMap.path);
			}


			if (sub_mod_exp) { // is function
				entryName = normalizeEntryName(entryName);

				trySet(handlerName, obj, entryName, sub_mod_exp);
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
				trySet(objName, obj, key, val);
			}
			else {
				functionExpectedAlert(objName, key);
			}
		}
		else {
			trySet(objName, obj, key, val);
		}
	});
}


function trySet (objName, obj, key, val) {
	if (typeof obj[key] === 'undefined') {
		obj[key] = val;
	}
	else {
		nameCollisionAlert(objName, key);
	}
}


function nameCollisionAlert (objName, key) {
	console.log(`Bootstruct Error: name collision on "${objName}" object.`);
	console.log(`   A prop/method named: "${key}" is already exists.`);
	console.log('   Use another name.');
}


function functionExpectedAlert (objName, key) {
	console.log(`Bootstruct Error: expecting "${key}" to be a function.`);
	console.log(`   For: "${objName}" object.`);
}


function hasIndex (entryMap) {
	if (!entryMap.type && !entryMap.entries['index.js']) {
		console.log('Bootstruct Error:');
		console.log('   Expecting an "index.js" file in:');
		console.log(`   ${entryMap.path}`);

		return false;
	}

	return true;
}


// ---------------------------
module.exports = function () {
	return Object.create(entryHandlers);
};
