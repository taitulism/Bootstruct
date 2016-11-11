'use strict';

const App = require('./lib/app');

module.exports = function (webRoot, debug) {
	const app = new App(webRoot, debug);

	return app.serverHandler;
};
