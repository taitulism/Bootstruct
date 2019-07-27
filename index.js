const App = require('./lib/app');
const log = require('./lib/utils/log');

module.exports = function bootstrcut (webRoot, debug) {
	const app = new App(webRoot, debug);

	if (debug) {
		log('Bootstruct - debugging mode started');
	}

	return app.requestHandler;
};
