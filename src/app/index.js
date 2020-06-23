const {resolve} = require('path');
const {existsSync: exists} = require('fs');
const requireFolder = require('require-folder');

const ctrlHooksProto = require('../ctrl/hooks');
const appHooksProto = require('./new-hooks');
// const appHooksProto = require('./hooks');
const getCtrlClass = require('../ctrl');
const getIOClass = require('../io');
const error = require('../errors');
const {ROOT_CTRL_NAME, FOLDER} = require('../constants');
const {
	forIn,
	f2j,
	normalizeEntryName,
} = require('../utils');

class App {
	constructor (folderName, isDebugMode) {
		if (!folderName) throw error.webRootFolderNotFound(folderName);
		const webRootFolderPath = resolve(folderName);

		if (!exists(webRootFolderPath)) {
			throw error.webRootFolderNotFound(webRootFolderPath);
		}

		this.webRootFolderName = folderName;
		this.webRootFolderPath = webRootFolderPath;

		this.ignoreStartWith = ['_', '.'];
		this.ignoreList = [];

		this.Ctrl = getCtrlClass(isDebugMode);
		this.IO = getIOClass();
		this.hooks = Object.create(appHooksProto);
		this.ctrlHooks = Object.create(ctrlHooksProto);

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
		if (this.hasInitHook) {
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
		const appHooks = this.hooks;
		const hooks = requireFolder(this.hooksFolderPath);

		forIn(hooks, (rawName, hook) => {
			const name = normalizeEntryName(rawName, false);

			if (appHooks[name]) {
				appHooks[name].call(this, hook);
			}
			else {
				this[name] = hook;
			}
		});

	}

	_parseAppHooks () {
		const appHooks = this.hooks;

		this.hooksMap = f2j(this.hooksFolderPath);

		forIn(this.hooksMap.entries, (rawName, map) => {
			const name = normalizeEntryName(rawName, map.type);

			if (appHooks[name]) {
				appHooks[name].call(this, map);
			}
			else {
				if (map.type === FOLDER && !map.entries['index.js']) {
					throw error.expectingAnIndexFile(map.path);
				}

				this[name] = require(map.path);
			}
		});
	}
}

// ------------------
module.exports = App;
