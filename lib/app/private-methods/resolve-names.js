'use strict';

const exists = require('fs').existsSync;
const $path  = require('path');

const getFilename = $path.basename;
const resolve     = $path.resolve;

module.exports = function (app, webRoot = 'www') {
	const hooksFolderName   = `${webRoot}_hooks`;
	const webRootFolderPath = resolve(webRoot);

	app.webRootFolderPath = webRootFolderPath;
	app.webRootFolderName = getFilename(webRootFolderPath);
	app.hooksFolderPath   = resolve(hooksFolderName);

	return exists(app.webRootFolderPath);
};
