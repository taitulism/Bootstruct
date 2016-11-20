'use strict';

const $path   = require('path');
const exists  = require('fs').existsSync;

const resolve     = $path.resolve;
const getFilename = $path.basename;

const appHooksProto   = require('./hooks');
const ctrlHooksProto  = require('../ctrl/hooks');
const createCtrlClass = require('../ctrl');
const createIOClass   = require('../io');
const error           = require('../errors');
const utils           = require('../utils');

const {forIn, f2j, normalizeEntryName} = utils;

module.exports = {
    resolveNames,
	initIgnoreList,
	initHooks,
    initPrototypes,
    parseHooks,
    setServerHandler,
    kill
};

function resolveNames (app, webRoot = 'www') {
	const hooksFolderName   = `${webRoot}_hooks`;
	const webRootFolderPath = resolve(webRoot);

	app.webRootFolderPath = webRootFolderPath;
	app.webRootFolderName = getWebRootName(webRootFolderPath);
	app.hooksFolderPath   = resolve(hooksFolderName);

	return exists(app.webRootFolderPath);
}

function initIgnoreList (app) {
	app.ignoreList      = [];
	app.ignoreStartWith = ['_', '.'];
}

function initHooks (app) {
    app.hooks = {
        app: Object.create(appHooksProto),
        ctrl: Object.create(ctrlHooksProto)
    };
}

function initPrototypes (app, debug) {
	app.Ctrl = createCtrlClass(debug);
	app.IO   = createIOClass();
	
	app.ctrl_proto = app.Ctrl.prototype;
	app.io_proto   = app.IO.prototype;
}

function parseHooks (app) {
    const appHooks = app.hooks.app;

	if (exists(app.hooksFolderPath)) {
		app.hooksMap = f2j(app.hooksFolderPath);

		forIn(app.hooksMap.entries, (entryName, entryMap) => {
			entryName = normalizeEntryName(entryName, entryMap.type);

			if (entryName === 'io_init') {
				app.io_init = true;
			}
			if (appHooks[entryName]) {
				appHooks[entryName].call(app, entryMap);
			}
			else {
				if (!entryMap.type && !entryMap.entries['index.js']) {
					return error.expectingAnIndexFile(entryMap.path);
				}

				app[entryName] = require(entryMap.path);
			}
		});
	}
}

function setServerHandler (app, fn) {
	if (fn) {
		app.serverHandler = fn;
	}
	else if (app.io_init) {
		app.serverHandler = (req, res) => {
			const io = new app.IO(req, res);

			io.init(app);
		};
	}
	else {
		app.serverHandler = (req, res) => {
			const io = new app.IO(req, res);

			app.RC.checkIn(io);
		};
	}

	app.serverHandler.global = app;
}

function kill (app) {
	error.cannotFindWebRootFolder(app.webRoot);

	setServerHandler((req, res) => {
		res.end('Bootstruct couldn\'t find the web-root folder.');
	});
}

function getWebRootName (webRootFolderPath) {
	return getFilename(webRootFolderPath);
}