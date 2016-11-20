'use strict';

const setServerHandler = require('./set-server-handler');
const error            = require('../errors');

module.exports = function (app) {
	error.cannotFindWebRootFolder(app.webRoot);

	setServerHandler((req, res) => {
		res.end('Bootstruct couldn\'t find the web-root folder.');
	});
};
