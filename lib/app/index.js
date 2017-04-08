'use strict';

const f2j = require('../utils').f2j;

const ROOT_CTRL_NAME = require('../constants').ROOT_CTRL_NAME;

const {
    resolveNames,
	init,
    parseHooks,
    setServerHandler,
    kill
} = require('./private-methods');

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

App.prototype.checkIn = function (io) {
	this.RC.checkIn(io);
};


// ------------------
module.exports = App;
