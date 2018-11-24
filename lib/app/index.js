'use strict';

const exists = require('fs').existsSync;

const resolveNames     = require('./private-methods/resolve-names');
const ctrlHooksProto   = require('../ctrl/hooks');
const appHooksProto    = require('./hooks');
const createCtrlClass  = require('../ctrl');
const createIOClass    = require('../io');
const error            = require('../errors');
const log              = require('../utils/log');
const {ROOT_CTRL_NAME} = require('../constants');
const {
	forIn,
	f2j,
	normalizeEntryName
} = require('../utils');

class App {
	constructor (webRoot, debug) {
		if (resolveNames(this, webRoot)) {
			this.ignoreList      = [];
			this.ignoreStartWith = ['_', '.'];
	
			this.hooks = {
				app: Object.create(appHooksProto),
				ctrl: Object.create(ctrlHooksProto)
			};
	
			this.Ctrl = createCtrlClass(debug);
			this.IO   = createIOClass();
			
			this.ctrl_proto = this.Ctrl.prototype;
			this.io_proto   = this.IO.prototype;
	
			this.parseAppHooks();
			this.setRequestHandler();
	
			const folderMap = f2j(this.webRootFolderPath);
			const parent    = null;
	
			this.RC = new this.Ctrl(ROOT_CTRL_NAME, folderMap, parent, this);
		}
		else {
			killApp(this, `Bootstruct couldn't find the web-root folder: ${this.webRootFolderPath}`);
		}
	}

	checkIn (io) {
		this.RC.checkIn(io);
	}

	setRequestHandler () {
		if (this.io_init) {
			this.requestHandler = (req, res) => {
				const io = new this.IO(req, res);
	
				io.init(this);
			};
		}
		else {
			this.requestHandler = (req, res) => {
				const io = new this.IO(req, res);
	
				this.RC.checkIn(io);
			};
		}
	
		// TODO: should expose App instance on the requestHandler function?
		// this.requestHandler.app = this;
	}

	parseAppHooks () {
		if (exists(this.hooksFolderPath)) {
			const appHooks = this.hooks.app;
			
			this.hooksMap = f2j(this.hooksFolderPath);
			
			forIn(this.hooksMap.entries, (entryName, entryMap) => {
				entryName = normalizeEntryName(entryName, entryMap.type);
	
				if (appHooks[entryName]) {
					appHooks[entryName].call(this, entryMap);
				}
				else {
					if (!entryMap.type && !entryMap.entries['index.js']) {
						return error.expectingAnIndexFile(entryMap.path);
					}
	
					this[entryName] = require(entryMap.path);
				}
			});
		}
	}

	addToIgnoreList (item) {
		if (typeof item !== 'string') {
			return error.ignoreItemIsNotAString(item);
		}
	
		const hooksNames = Object.keys(this.ctrl_proto);
	
		item = item.toLowerCase();
	
		if (hooksNames.includes(item)) {
			return error.cannotIgnoreReservedEntryName(item);
		}
	
		this.ignoreList.push(item);
	}
}

function killApp (errorMessage) {
	log('Bootstruct Error:');
	
	throw new Error(errorMessage);
}

// ------------------
module.exports = App;
