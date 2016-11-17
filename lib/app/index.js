'use strict';

const error = require('../errors');
const utils = require('../utils');

const {
    resolveNames,
    initPrototypes,
    parseHooks,
    setServerHandler,
    kill
} = require('./private-methods');

const {f2j, getProto} = utils;

function App (webRoot, debug) {
	if (resolveNames(this, webRoot)) {
		initPrototypes(this, debug);

		parseHooks(this);

		setServerHandler(this);

		const rootCtrlName = 0;
		const folderMap = f2j(this.webRoot);
		const parent = null;

		this.RC = new this.Ctrl(rootCtrlName, folderMap, parent, this);
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

	const entryHandlersProto = getProto(this.webRoot_entryHandlers);
	const entryHandlersNames = Object.keys(entryHandlersProto);

	item = item.toLowerCase();

	if (entryHandlersNames.includes(item)) {
		return error.cannotIgnoreReservedEntryName(item);
	}

	this.ignoreList.push(item);
};

appProto.checkIn = function (io) {
	this.RC.checkIn(io);
};


// ------------------
module.exports = App;
