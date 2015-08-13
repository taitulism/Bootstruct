'use strict';

var resolve = require('path').resolve;

var IO        = require('./lib/io');
var createApp = require('./lib/app');
var map       = require('./lib/utils/f2j');
var forIn     = require('./lib/utils/forIn');




 /*─────────────────────────────────────────────────────────────────────────────
 │  Bootstruct outer API (exported)
 │  --------------------
 │
 │  args:
 │  	webRoot [str] - The folder name to be parse as the app's root-controller (default: 'www')
 │  
 │  returns:
 │  	handler [fn] - To be called with: request, response.
 │
*/
function bootstruct (webRoot, CFG) {
	var resolvedPath, rootMap, app;

	webRoot = webRoot || 'www';
	
	resolvedPath = resolve(webRoot);

	rootMap = map(resolvedPath);

	app = createApp(CFG, rootMap);

	return function handler (req, res) {
		var io = new IO(req, res);

		return app.RC.checkIn(io);
	};
}




// -------------------------
module.exports = bootstruct;