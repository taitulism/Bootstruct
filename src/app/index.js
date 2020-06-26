const {resolve} = require('path');
const {existsSync: exists} = require('fs');
// const requireFolder = require('require-folder');
const requireFolder = require('../../../require-folder');

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

		// const folderMap = f2j(this.webRootFolderPath);
		const rootCoreObj = requireFolder(this.webRootFolderPath, {
			alias: {
				in: '_in',
				out: '_out',
				index: ['_before_verb', '_before-verb'],
				get: '_get',
				post: '_post',
				put: '_put',
				delete: '_delete',
				noVerb: ['_no-verb', '_no_verb-verb'],
				afterVerb: ['_after_verb', '_after-verb'],
				preMethod: ['_pre_method', '_pre-method'],
				postMethod: ['_post_method', '_post-method'],
				preSub: ['_pre_sub', '_pre-sub'],
				postSub: ['_post_sub', '_post-sub'],
			},
			hooks: {
				_verbs (obj, map) {
					obj.verbs = requireFolder(map.path);
				},
				get (obj, map) {
					obj.verbs = obj.verbs || {};
					obj.verbs.get = requireFolder(map.path);
				},
				post (obj, map) {
					obj.verbs = obj.verbs || {};
					obj.verbs.post = requireFolder(map.path);
				},
				put (obj, map) {
					obj.verbs = obj.verbs || {};
					obj.verbs.put = requireFolder(map.path);
				},
				delete (obj, map) {
					obj.verbs = obj.verbs || {};
					obj.verbs.delete = requireFolder(map.path);
				},
			}
		});
		const parent = null;

		this.RC = new this.Ctrl(ROOT_CTRL_NAME, rootCoreObj, parent, this);
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
		const hooks = requireFolder(this.hooksFolderPath, {
			alias: {
				in: '_in',
				out: '_out',
				index: ['_before_verb', '_before-verb'],
				get: '_get',
				post: '_post',
				put: '_put',
				delete: '_delete',
				noVerb: ['_no-verb', '_no_verb-verb'],
				afterVerb: ['_after_verb', '_after-verb'],
				preMethod: ['_pre_method', '_pre-method'],
				postMethod: ['_post_method', '_post-method'],
				preSub: ['_pre_sub', '_pre-sub'],
				postSub: ['_post_sub', '_post-sub'],
			},
			hooks: {
				_verbs (obj, map) {
					obj.verbs = requireFolder(map.path);
				},
				get (obj, map) {
					obj.verbs = obj.verbs || {};
					obj.verbs.get = requireFolder(map.path);
				},
				post (obj, map) {
					obj.verbs = obj.verbs || {};
					obj.verbs.post = requireFolder(map.path);
				},
				put (obj, map) {
					obj.verbs = obj.verbs || {};
					obj.verbs.put = requireFolder(map.path);
				},
				delete (obj, map) {
					obj.verbs = obj.verbs || {};
					obj.verbs.delete = requireFolder(map.path);
				},
			}
		});

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
