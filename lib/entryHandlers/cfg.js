'use strict';


var webRootHandlers = require('./ctrl');
var helpers         = require('../helpers');
var removeExt       = helpers.removeExt;
var tryReqFn        = helpers.tryReqFn;
var tryReqObj       = helpers.tryReqObj;
var forIn           = require('../utils/forIn');
var controller      = require('../ctrl');
var Ctrl            = controller.Ctrl;
var ctrlProto       = controller.proto;
var addToIgnoreList = controller.addToIgnoreList;
var ioProto         = require('../io').proto;

var entryHandlers = {
	ctrl_proto: function (entryMap) {
		requireToProto(0, entryMap);
	},

	io_proto: function (entryMap) {
		requireToProto(1, entryMap);
	},

	io_init: function (entryMap) {
		var customInitFn = tryReqFn(entryMap.path);

		if (customInitFn) {
			ioProto.init = customInitFn;
		}
	},

	ignore: function (entryMap) {
		var cfgIgnore   = require(entryMap.path);

		if (Array.isArray(cfgIgnore)) {
			cfgIgnore.forEach(addToIgnoreList);
		}
		else {
			console.log('Bootstruct Error:');
			console.log('   "ignore" cfg handler should export an array of strings.');
		}
	},

	entry_handlers: function (entryMap) {
		var handlersObj = (entryMap.type === 0)? entryMap.entries : tryReqObj(entryMap.path);

		if (handlersObj) {
			forIn(handlersObj, function (entryName, _entryMap) {
				var entryHandler;

				entryName = removeExt(entryName);

				entryHandler = tryReqFn(_entryMap.path);

				if (entryHandler) {
					webRootHandlers[entryName] = entryHandler;
				}
			});
		}
	},

	shared_methods: function (entryMap) {
		var customShared = (entryMap.type === 0)? entryMap.entries : tryReqFn(entryMap.path);
		var sharedObj    = Object.create(null);

		if (customShared) {
			forIn(customShared, function (entryName, _entryMap) {
				var method;

				entryName = removeExt(entryName);

				method = tryReqFn(_entryMap.path);

				if (method) {
					sharedObj[entryName] = method;
				}
			});

			this._shared_methods = sharedObj;
		}
	},

	shared_ctrls: function (entryMap) {
		var self      = this;
		var sharedObj = Object.create(null);

		forIn(entryMap.entries, function (entryName, _entryMap) {
			entryName = removeExt(entryName);

			sharedObj[entryName] = new Ctrl(_entryMap, entryName, null, self, false);
		});

		this._shared_ctrls = sharedObj;
	}
};



 /*
 | "who" can be the ctrlProto (0) or the ioProto (1)
*/
function requireToProto (who, entryMap) {
	var proto     = (who) ? ioProto : ctrlProto;
	var customObj = (entryMap.type === 0) ? entryMap.entries : tryReqObj(entryMap.path);

	if (customObj) {

		forIn(customObj, function (key, val) {
			 /*
			 | this loop is a bit tricky because of customObj's different values.
			 |
			 | folder.entries of an entryMap:
			 | 		key = entryName
			 | 		val = entryMap
			 |
			 | object from a file:
			 |		key = key
			 |		val = function
			 |
			 | "key" is pretty similar
			 | "val" is either a function (if customObj is a file) or an entryMap (if it's a folder)
			*/

			var name, method;


			 /*
			 | file
			 | exports an object e.g. {name:fn,name:fn,}
			*/
			if (typeof val === 'function') {
				trySetOnProto(who, proto, key, val);
			}


			 /*
			 | folder
			 | "val" is an entryMap
			 | whose entries export a single function (each).
			*/
			else if (val.path) {
				if (!val.type && !val.entries['index.js']) {
					console.log('Bootstruct Error:');
					console.log('   When requiring a folder, Node expects an "index.js" file:');
					console.log('   ' + val.path);

					return false;
				}

				method = tryReqFn(val.path);

				if (method) {
					name = removeExt(key);
					trySetOnProto(who, proto, name, method);
				}
			}
		});
	}
}


 /*
 | set stuff in ioProto and ctrlProto if not exist
 | "who" can be the ctrlProto (0) or the ioProto (1)
*/
function trySetOnProto (who, proto, name, method) {
	if (typeof proto[name] == 'undefined') {
		proto[name] = method;
	}
	else {
		 /*
		 | error log for prototype overriding.
		 | "who" can be the ctrlProto (0) or the ioProto (1)
		*/
		who = (who) ? 'IO' : 'Ctrl';

		console.log('Bootstruct Error:');
		console.log('   You are overriding ' + who + '\'s "' + name + '" prop/method.');
		console.log('   Use another name.');
	}
}




// ----------------------------
module.exports = entryHandlers;
