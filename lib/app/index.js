'use strict';

const error = require('../errors');
const utils = require('../utils');

const ROOT_CTRL_NAME = require('../constants').ROOT_CTRL_NAME;

const {
    resolveNames,
	init,
    parseHooks,
    setServerHandler,
    kill
} = require('./private-methods');

const {f2j, getProto} = utils;

function App (webRoot, debug) {
	if (resolveNames(this, webRoot)) {
		init.ignoreList(this);
		init.hooks(this);
		init.prototypes(this, debug);
		parseHooks(this);
		setServerHandler(this);

		const folderMap = f2j(this.webRootFolderPath);
		const parent    = null;

		this.RC = new this.Ctrl(ROOT_CTRL_NAME, folderMap, parent, this);
	}
	else {
		kill(this);
	}
}

const appProto = App.prototype;

appProto.addToIgnoreList = function (item) {
	if (typeof item !== 'string') {
		return error.ignoreItemIsNotAString(item);
	}

	const ctrlHooksProto = getProto(this.hooks.ctrl);
	const hooksNames = Object.keys(ctrlHooksProto);

	item = item.toLowerCase();

	if (hooksNames.includes(item)) {
		return error.cannotIgnoreReservedEntryName(item);
	}

	this.ignoreList.push(item);
};

appProto.checkIn = function (io) {
	this.RC.checkIn(io);
};


// ------------------
module.exports = App;
