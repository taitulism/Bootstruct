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
 │  	appRoot [str] - The folder name to be parse as the app's root-controller
 │  
 │  returns:
 │  	handler [fn] - To be called with: request, response.
 │  
 │	code stroy:
 │		* Bootstruct Fn is called with a folder name and resolves it. default: 'app'.
 │		* Next Bts maps this folder (if exists).
 │		* create the root controller (RC):
 │			new Ctrl(folderMap, id, owner);
 │		* returns the final handler function 
 │
*/
function bootstruct (appRoot) {
	var resolvedPath, rootMap, RC;

	appRoot = appRoot || 'app';
	
	resolvedPath = resolve(appRoot);

	rootMap = map(resolvedPath);

	RC = new Ctrl(rootMap, '/', null);
	
	return function handler (req, res) {
		var io = new IO(req, res);

		return RC.checkIn(io);
	};
}


// -------------------------
module.exports = bootstruct;
