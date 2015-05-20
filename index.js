'use strict';

var Ctrl    = require('./lib/constructors/ctrl');
var IO      = require('./lib/constructors/io');
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
 │  	middleware [fn] - To be called with: request, response.
 │  
 │	code stroy:
 │		* Bootstruct Fn is called with a folder name and resolves it. default: 'app'.
 │		* Next Bts maps this folder (if exists).
 │		* create the root controller (RC):
 │			new Ctrl(folderMap, id, owner);
 │		* returns the final middleware function 
 │
*/
function bootstruct (appRoot) {
	var resolvedPath, rootMap, RC;

	appRoot = appRoot || 'app';
	
	resolvedPath = resolve(appRoot);

	rootMap = map(resolvedPath);

	RC = new Ctrl(rootMap, 'RC', null);
	
	return function middleware (req, res) {
		var io = new IO(req, res);

		return RC.checkIn(io);
	};
}


// -------------------------
module.exports = bootstruct;
