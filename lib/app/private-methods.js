'use strict';

const resolve = require('path').resolve;
const exists  = require('fs').existsSync;

const appHooks        = require('./hooks');
const ctrlHooks       = require('../ctrl/hooks');
const createCtrlClass = require('../ctrl');
const createIOClass   = require('../io');
const error           = require('../errors');
const utils           = require('../utils');

const {forIn, f2j, normalizeEntryName} = utils;

module.exports = {
    resolveNames,
    initPrototypes,
    parseHooks,
    setServerHandler,
    kill
};

function resolveNames (app, webRoot = 'www') {
	const hooks = `${webRoot}_hooks`;

	app._webRoot = webRoot;
	app.webRoot  = resolve(webRoot);
	app.hooks    = resolve(hooks);

	return exists(app.webRoot);
}

function initPrototypes (app, debug) {
	app.ignoreList      = [];
	app.ignoreStartWith = ['_', '.'];

    app.hooks = {
        app: Object.create(appHooks),
        ctrl: Object.create(ctrlHooks)
    };

	app.Ctrl       = createCtrlClass(debug);
	app.IO         = createIOClass();
	app.ctrl_proto = app.Ctrl.prototype;
	app.io_proto   = app.IO.prototype;
}

function parseHooks (app) {
    const appHooks = app.hooks.app;

	if (exists(appHooks)) {

		app.hooksMap = f2j(appHooks);

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

	return app;
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

	app.setServerHandler((req, res) => {
		res.end('Bootstruct couldn\'t find the web-root folder.');
	});
}
