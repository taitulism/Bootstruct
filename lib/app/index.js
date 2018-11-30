'use strict';

const {resolve} = require('path');
const {existsSync: exists}  = require('fs');

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
	constructor (folderName, debug) {
		folderName = folderName || 'www';
		
		const webRootFolderPath = resolve(folderName);

		if (!exists(webRootFolderPath)) {
			return killApp(this, `Bootstruct couldn't find the web-root folder: \n  "${webRootFolderPath}" \n`);
		}
		
		this.webRootFolderName = folderName;
		this.webRootFolderPath = webRootFolderPath;
	
		this.ignoreStartWith = ['_', '.'];
		this.ignoreList = [];

		this.hooks = {
			app: Object.create(appHooksProto),
			ctrl: Object.create(ctrlHooksProto)
		};

		this.Ctrl = createCtrlClass(debug);
		this.IO   = createIOClass();
		
		this.ctrl_proto = this.Ctrl.prototype;
		this.io_proto   = this.IO.prototype;

		const hooksFolderPath = `${webRootFolderPath}_hooks`;

		if (exists(hooksFolderPath)) {
			this.hooksFolderPath = hooksFolderPath;

			this.parseAppHooks();
		}
		
		this.setRequestHandler();

		const folderMap = f2j(this.webRootFolderPath);
		const parent = null;

		this.RC = new this.Ctrl(ROOT_CTRL_NAME, folderMap, parent, this);
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

function killApp (app, errorMessage) {
	log('Bootstruct Error:');

	throw new Error(errorMessage);
}

// ------------------
module.exports = App;
