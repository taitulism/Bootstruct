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


function App (webRoot, debug) {
	// this.ctrls = Object.create(null);

	if (this.resolveNames(webRoot)) {
		this.initPrototypes(debug);

		this.parseHooks();

		this.setServerHandler();

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

	this._webRoot = webRoot;
	this.webRoot  = resolve(webRoot);
	this.hooks    = resolve(hooks);

	return exists(this.webRoot);
};



appProto.setServerHandler = function (fn) {
	var self = this;

	if (fn) {
		this.serverHandler = fn;
	}
	else {
		if (this.io_init) {
			this.serverHandler = function (req, res) {
				var io = new self.IO(req, res);

				io.init(self);
			};
		}
		else {
			this.serverHandler = function (req, res) {
				var io = new self.IO(req, res);

				self.RC.checkIn(io);
			};
		}
	}

	this.serverHandler.global = this;
};



appProto.initPrototypes = function (debug) {
	this.ignoreList      = [];
	this.ignoreStartWith = ['_', '.'];

	this.webRoot_entryHandlers = getWebRootHandlers();
	this.hooks_entryHandlers   = getHooksHandlers();

	this.Ctrl       = createCtrlClass(debug);
	this.IO         = createIOClass();
	this.ctrl_proto = this.Ctrl.prototype;
	this.io_proto   = this.IO.prototype;
};



appProto.addToIgnoreList = function (item) {
	var entryHandlers = Object.keys(this.webRoot_entryHandlers.__proto__);

	item = item.toLowerCase();

	if (typeof item != 'string') {
		console.log('Bootstruct Error:');
		console.log('   "ignore" hook handler should export a string or an array of strings.');
		console.log('   skipping: ' + '"' + item + '"');
		return;
	}

	// trying to ignore a reserved entry name
	if (~entryHandlers.indexOf(item)) {
		console.log('Bootstruct Error:');
		console.log('   "ignore" hook: Trying to ignore a reserved entry name.');
		console.log('   skipping: ' + '"' + item + '"');
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

			if (entryName == 'io_init') {
				self.io_init = true;
			}

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
module.exports = function create (webRoot, debug) {
	var app = new App(webRoot, debug);

	return app.serverHandler;
};
