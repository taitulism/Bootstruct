'use strict';

const log = require('../../utils/log');

module.exports = function (app) {
	log('Bootstruct Error:');

	const errorMessage = `Bootstruct couldn't find the web-root folder: ${app.webRootFolderPath}`;

	throw new Error(errorMessage);
};
