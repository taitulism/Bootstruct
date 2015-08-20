'use strict';


var webRootHandlers    = require('./web-root');
var entryHandlersUtils = require('./utils');
var normalizeEntryName = entryHandlersUtils.normalizeEntryName;
var tryReqFn           = entryHandlersUtils.tryReqFn;
var tryReqObj          = entryHandlersUtils.tryReqObj;
var forIn              = require('../utils/forIn');
var controller         = require('../ctrl');
var Ctrl               = controller.Ctrl;
var ctrlProto          = controller.proto;
var ioProto            = require('../io').proto;



var entryHandlers = {
	io_proto: function (entryMap) {
		var protoObj = (entryMap.type === 0)? entryMap.entries : tryReqObj(entryMap.path);

		if (protoObj) {
			forIn(protoObj, function (entryName, _entryMap) {
				var protoFn;

				entryName = normalizeEntryName(entryName, _entryMap.type);

				protoFn = tryReqFn(_entryMap.path);

				if (protoFn) {
					ioProto[entryName] = protoFn;
				}
			});
		}
	},

	io_init: function (entryMap) {

		var customInitFn = tryReqFn(entryMap.path);

		if (customInitFn) {
			ioProto.init = customInitFn;
		}

	},

	ctrl_proto: function (entryMap) {
		var customObj = (entryMap.type === 0) ? entryMap.entries : tryReqObj(entryMap.path);;

		if (customObj) {
			forIn(customObj, function (key, fn) {
				var protoFn;

				if (typeof fn === 'function') {
					ctrlProto[key] = fn;
				}
				else if (fn.path) {
					protoFn = tryReqFn(fn.path);
					
					if (protoFn) {
						key = normalizeEntryName(key, fn.type);
						ctrlProto[key] = protoFn;
					}
				}
			});
		}
	},

	entry_handlers: function (entryMap) {
		var handlersObj = (entryMap.type === 0)? entryMap.entries : tryReqObj(entryMap.path);

		if (handlersObj) {
			forIn(handlersObj, function (entryName, _entryMap) {
				var entryHandler;

				entryName = normalizeEntryName(entryName, _entryMap.type);

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

				entryName = normalizeEntryName(entryName, _entryMap.type);

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
			entryName = normalizeEntryName(entryName, _entryMap.type);

			sharedObj[entryName] = new Ctrl(_entryMap, entryName, null, self, false);
		});

		this._shared_ctrls = sharedObj;
	}
};




// ----------------------------
module.exports = entryHandlers;
