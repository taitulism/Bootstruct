'use strict';

var Ctrl    = require('./lib/ctrl');
var IO      = require('./lib/io');
var map     = require('./lib/utils/f2j');
var resolve = require('path').resolve;


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
function bootstruct (webRoot) {
	var resolvedPath, rootMap, RC;

	webRoot = webRoot || 'www';
	
	resolvedPath = resolve(webRoot);

	rootMap = map(resolvedPath);

	RC = new Ctrl(rootMap, '/', null);
	
	return function handler (req, res) {
		var io = new IO(req, res);

		return RC.checkIn(io);
	};
}


// -------------------------
module.exports = bootstruct;
