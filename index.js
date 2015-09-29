'use strict';


var appProto;

var resolve = require('path').resolve;
var exists  = require('fs').existsSync;

var map                = require('./lib/utils/f2j');
var forIn              = require('./lib/utils/forIn');
var getHooksHandlers   = require('./lib/entryHandlers/hooks');
var getWebRootHandlers = require('./lib/entryHandlers/ctrl');
var normalizeEntryName = require('./lib/helpers').normalizeEntryName;
var createCtrlClass    = require('./lib/ctrl');
var createIOClass      = require('./lib/io');


function App (webRoot) {
	this.ctrls = Object.create(null);

	if (this.resolveNames(webRoot)) { // Deal Breaker
		this.setServerHandler();

		this.initPrototypes();

		this.parseHooks();

		this.RC = new this.Ctrl(0, map(this.webRoot), null, this);
	}
	else {
		this.die();
	}
}



appProto = App.prototype;



appProto.resolveNames = function (webRoot) {
	var hooks;

	webRoot = webRoot || 'www';
	hooks   = webRoot + '_hooks';

	this.webRoot = resolve(webRoot);
	this.hooks   = resolve(hooks);

	return exists(this.webRoot);
};



appProto.setServerHandler = function (fn) {
	var self = this;

	this.serverHandler = fn || function (req, res) {
		var io = new self.IO(req, res);

		if (io.init) {
			if (io.init.async) {
				io.init(self);
			}
			else {
				io.init();
				self.RC.checkIn(io);
			}
		}
		else {
			self.RC.checkIn(io);
		}
	};

	this.serverHandler.global = this;
};



appProto.initPrototypes = function () {
	this.ignoreList            = [];
	this.ignoreStartWith       = ['_', '.'];
	this.webRoot_entryHandlers = getWebRootHandlers();
	this.hooks_entryHandlers     = getHooksHandlers();
	this.Ctrl                  = createCtrlClass();
	this.IO                    = createIOClass();
	this.ctrl_proto            = this.Ctrl.prototype;
	this.io_proto              = this.IO.prototype;
};



appProto.addToIgnoreList = function (item) {
	if (typeof item != 'string') {
		console.log('Bootstruct Error:');
		console.log('   "ignore" hook handler should export an array of strings.');
		console.log('   skipping: ', item );
		return;
	}


	this.ignoreList.push(item);
};



appProto.parseHooks = function () {
	var hooksMap;

	var self = this;

	if (exists(this.hooks)) {

		this.hooksMap = map(this.hooks);

		forIn(this.hooksMap.entries, function (entryName, entryMap) {
			entryName = normalizeEntryName(entryName, entryMap.type);

			if (self.hooks_entryHandlers[entryName]) {
				self.hooks_entryHandlers[entryName].call(self, entryMap);
			}
			else {
				if (!entryMap.type && !entryMap.entries['index.js']) {
					console.log('Bootstruct Error:');
					console.log('   Expecting an "index.js" file in:');
					console.log('   ' + entryMap.path);

					return null;
				}

				self[entryName] = require(entryMap.path);
			}
		});

	}

	return self;
};



appProto.checkIn = function (io) {
	this.RC.checkIn(io);
};



appProto.die = function () {
	console.log("Bootstruct couldn't find the web-root folder: ");
	console.log('    ' + this.webRoot);

	this.setServerHandler(function (req, res) {
		res.end("Bootstruct couldn't find the web-root folder.");
	});
};



// -----------------------------------------
module.exports = function create (webRoot) {
	var app = new App(webRoot);

	return app.serverHandler;
};
