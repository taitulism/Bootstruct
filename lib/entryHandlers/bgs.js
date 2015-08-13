'use strict';

var normalizeEntryName = require('./normalize');
var forIn              = require('../utils/forIn');
var io                 = require('../io');



var entryHandlers = {
	io_proto: function (entryMap) {
		var ioProto = io.proto;

		forIn(entryMap.entries, function (entryName, _entryMap) {
			entryName = normalizeEntryName(entryName, _entryMap.type);

			ioProto[entryName] = require(_entryMap.path);
		});
	},

	io_init: function (entryMap) {

		var customInitFn = require(entryMap.path);

		if (typeof customInitFn == 'function') {
			io.setInitFn(customInitFn);
		}
		else {
			console.log('Bootstruct Error:')
			console.log('"io_initFn" hook should export a single function');
			console.log('Got:', fn);			
		}
	}
};




// ----------------------------
module.exports = entryHandlers;