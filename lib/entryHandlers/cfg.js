'use strict';


var webRootHandlers    = require('./ctrl');
var helpers            = require('../helpers');
var removeExt          = helpers.removeExt;
var tryReqFn           = helpers.tryReqFn;
var tryReqObj          = helpers.tryReqObj;
var normalizeEntryName = helpers.normalizeEntryName;
var forIn              = require('../utils/forIn');
var controller         = require('../ctrl');
var Ctrl               = controller.Ctrl;
var ctrlProto          = controller.proto;
var addToIgnoreList    = controller.addToIgnoreList;
var ioProto            = require('../io').proto;


// exported later
var entryHandlers = {

	ignore: function (entryMap) {
		var cfgIgnore;

		/* Deal Breaker */ if (entryMap.type === 0 && !hasIndex(entryMap)) return;

		cfgIgnore = require(entryMap.path);

		if (Array.isArray(cfgIgnore)) {
			cfgIgnore.forEach(addToIgnoreList);
		}
		else {
			console.log('Bootstruct Error:');
			console.log('   "ignore" cfg handler should export an array of strings.');
		}
	},


	io_init: function (entryMap) {
		var customInitFn;

		if (!entryMap.type && !entryMap.entries['index.js']) {
			console.log('Bootstruct Error:');
			console.log('   Expecting an "index.js" file in:');
			console.log('   ' + entryMap.path);

			return;
		}

		customInitFn = tryReqFn(entryMap.path);

		if (customInitFn) {
			if (customInitFn.length < 1) {
				console.log('Bootstruct Error:');
				console.log('   The "io_init" function (an async function) accepts a single argument (app).');
				console.log('   You should call "app.checkIn(io);" when function is done.');
				return;
			}

			ioProto.init = customInitFn;
		}
	},


	io_proto: function (entryMap) {
		handleEntry('io_proto', entryMap, ioProto, 1);
	},


	ctrl_proto: function (entryMap) {
		handleEntry('ctrl_proto', entryMap, ctrlProto, 1);
	},


	entry_handlers: function (entryMap) {
		handleEntry('entry_handlers', entryMap, webRootHandlers, 1);
	},

	shared_methods: function (entryMap) {
		var shared_methods = Object.create(null);

		// this = app
		this.shared_methods = handleEntry('entry_handlers', entryMap, shared_methods, 1);
	},

	shared_ctrls: function (entryMap) {
		var self, shared_ctrls;

		/* Deal Breaker */ if (entryMap.type !== 0) {
			console.log('Bootstruct Error: "shared_ctrls"');
			console.log('   Controllers must be folders:', entryMap.path);
			return;
		}

		self = this; // app

		shared_ctrls = Object.create(null);

		forIn(entryMap.entries, function (entryName, _entryMap) {
			entryName = normalizeEntryName(entryName, false);

			shared_ctrls[entryName] = new Ctrl(entryName, _entryMap, null, self);
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
	var mod_exp; // module.exports
	if (entryMap.type === 1) { // file
		mod_exp = tryReqObj(entryMap.path);

		if (mod_exp) {
			extend(handlerName, obj, mod_exp, typeFn);
		}
	}
	else { // folder
		forIn(entryMap.entries, function (entryName, subEntryMap) {
			var sub_mod_exp;

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

				trySet (handlerName, obj, entryName, sub_mod_exp);
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
	forIn(extObj, function (key, val) {
		if (typeFn) {
			if (typeof val === 'function') {
				trySet(objName, obj, key, val);
			}
			else {
				FunctionExpectedAlert(objName, key);
			}
		}
		else {
			trySet(objName, obj, key, val);
		}
	});
}


function trySet (objName, obj, key, val) {
	if (typeof obj[key] == 'undefined') {
		obj[key] = val;
	}
	else {
		nameCollisionAlert(objName, key);
	}
}


function nameCollisionAlert (objName, key) {
	console.log('Bootstruct Error: name collision on "' + objName + '" object.');
	console.log('   A prop/method named: "' + key + '" is already exists.');
	console.log('   Use another name.');
}


function FunctionExpectedAlert (objName, key) {
	console.log('Bootstruct Error: expecting "' + key + '" to be a function.');
	console.log('   For: "' + objName + '" object.');
}


function hasIndex (entryMap) {
	if (!entryMap.entries['index.js']) {
		console.log('Bootstruct Error:');
		console.log('   Expecting an "index.js" file in:');
		console.log('   ' + entryMap.path);

		return false;
	}

	return true;
}


// ----------------------------
module.exports = entryHandlers;