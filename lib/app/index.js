'use strict';

const f2j = require('../utils').f2j;

const resolveNames     = require('./private-methods/resolve-names');
const init             = require('./private-methods/init');
const parseHooks       = require('./private-methods/parse-hooks');
const setServerHandler = require('./private-methods/set-server-handler');
const kill             = require('./private-methods/kill');

const ROOT_CTRL_NAME = require('../constants').ROOT_CTRL_NAME;

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
