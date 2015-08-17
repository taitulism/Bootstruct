'use strict';


var IO        = require('./lib/io').IO;
var createApp = require('./lib/app');




 /*─────────────────────────────────────────────────────────────────────────────
 │  Bootstruct outer API
 │  --------------------
 │
 │  argument:
 │  	webRoot [str] - The folder name to be parse as the app's root-controller 
 │                      default: 'www'
 │  
 │  returns:
 │  	handler [fn] - To be called with: request, response.
 │
*/
module.exports = function bootstruct(webRoot) {
	var	app = createApp(webRoot);

	return function bootstruct_handler (req, res) {
		var io = new IO(req, res);

		return app.RC.checkIn(io);
	};
};