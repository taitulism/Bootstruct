'use strict';

const resolve = require('path').resolve;
const exists  = require('fs').existsSync;

const getHooksHandlers   = require('./entryHandlers/hooks');
const getWebRootHandlers = require('./entryHandlers/ctrl');
const createCtrlClass    = require('./ctrl');
const createIOClass      = require('./io');
const utils              = require('./utils');

const map                = utils.f2j;
const forIn              = utils.forIn;
const normalizeEntryName = utils.normalizeEntryName;


function App (webRoot, debug) {
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


const appProto = App.prototype;


appProto.resolveNames = function (webRoot = 'www') {
	const hooks = `${webRoot}_hooks`;

	this._webRoot = webRoot;
	this.webRoot  = resolve(webRoot);
	this.hooks    = resolve(hooks);

	return exists(this.webRoot);
};


appProto.setServerHandler = function (fn) {
	if (fn) {
		this.serverHandler = fn;
	}
	else if (this.io_init) {
		this.serverHandler = (req, res) => {
			const io = new this.IO(req, res);

			io.init(this);
		};
	}
	else {
		this.serverHandler = (req, res) => {
			const io = new this.IO(req, res);

			this.RC.checkIn(io);
		};
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
	const entryHandlers = Object.keys(Object.getPrototypeOf(this.webRoot_entryHandlers));

	item = item.toLowerCase();

	if (typeof item !== 'string') {
		console.log('Bootstruct Error:');
		console.log('   "ignore" hook handler should export a string or an array of strings.');
		console.log(`   skipping: "${item}"`);
		return;
	}

	// trying to ignore a reserved entry name
	if (entryHandlers.includes(item)) {
		console.log('Bootstruct Error:');
		console.log('   "ignore" hook: Trying to ignore a reserved entry name.');
		console.log(`   skipping: "${item}"`);
		return;
	}


	this.ignoreList.push(item);
};


appProto.parseHooks = function () {
	if (exists(this.hooks)) {

		this.hooksMap = map(this.hooks);

		forIn(this.hooksMap.entries, (entryName, entryMap) => {
			entryName = normalizeEntryName(entryName, entryMap.type);

			if (entryName === 'io_init') {
				this.io_init = true;
			}

			if (this.hooks_entryHandlers[entryName]) {
				this.hooks_entryHandlers[entryName].call(this, entryMap);
			}
			else {
				if (!entryMap.type && !entryMap.entries['index.js']) {
					console.log('Bootstruct Error:');
					console.log('    Expecting an "index.js" file in:');
					console.log(`    ${entryMap.path}`);

					return null;
				}

				this[entryName] = require(entryMap.path);
			}
		});

	}

	return this;
};


appProto.checkIn = function (io) {
	this.RC.checkIn(io);
};


appProto.die = function () {
	console.log('Bootstruct couldn\'t find the web-root folder: ');
	console.log(`    ${this.webRoot}`);

	this.setServerHandler((req, res) => {
		res.end('Bootstruct couldn\'t find the web-root folder.');
	});
};


// ------------------
module.exports = App;
