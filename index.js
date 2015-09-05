'use strict';

var resolve            = require('path').resolve;
var exists             = require('fs').existsSync;

var Ctrl               = require('./lib/ctrl').Ctrl;
var IO                 = require('./lib/io').IO;
var map                = require('./lib/utils/f2j');
var forIn              = require('./lib/utils/forIn');
var CFGHandlers        = require('./lib/entryHandlers/cfg');
var normalizeEntryName = require('./lib/helpers').normalizeEntryName;


var hasOwn = Object.prototype.hasOwnProperty;




function initAppObj () {
	var checkIn;
	var app = Object.create(null);

	app.ctrls = Object.create(null);

	app.checkIn = function (io) {
		app.RC.checkIn(io);
	};

	app._serverHandler = function (req, res) {
		var io = new IO(req, res);

		if (io.init) {
			if (io.init.async) {
				io.init(app);
			}
			else {
				io.init();
				app.RC.checkIn(io);
			}
		}
		else {
			app.RC.checkIn(io);
		}

	};

	app._serverHandler.global = app;

	return app;
}




function mapWebRoot (webRoot) {
	var webRootMap;

	// resolve folder name
	var resolved_webRoot = resolve(webRoot);

	/* Deal Breaker */ if (!exists(resolved_webRoot)) {
		return resolved_webRoot;
	}

	// map web-root folder (f2j)
	webRootMap = map(resolved_webRoot);

	return webRootMap;
}




function no_webRoot (resolved_webRoot) {
	console.log("Bootstruct couldn't find your web-root folder: ");
	console.log('    ' + resolved_webRoot);

	return function (req, res) {
		res.end("Bootstruct couldn't find your web-root folder.");
	};
}




function parseCFG (webRoot, app) {
	var cfgMap;

	var cfg          = webRoot + '_cfg';
	var resolved_cfg = resolve(cfg);

	if (exists(resolved_cfg)) {

		// map cfg folder (f2j)
		cfgMap = map(resolved_cfg);

		forIn(cfgMap.entries, function (entryName, entryMap) {
			entryName = normalizeEntryName(entryName, entryMap.type);

			if (hasOwn.call(CFGHandlers, entryName)) {
				CFGHandlers[entryName].call(app, entryMap);
			}
			else {
				if (!entryMap.type && !entryMap.entries['index.js']) {
					console.log('Bootstruct Error:');
					console.log('   Expecting an "index.js" file in:');
					console.log('   ' + entryMap.path);

					return null;
				}

				app[entryName] = require(entryMap.path);
			}
		});
	}

	return app;
}




function create (webRoot) {
	var webRootMap;

	// app
	var app = initAppObj();

	// set folder names
	webRoot = webRoot || 'www';

	webRootMap = mapWebRoot(webRoot);

	/* Deal Breaker */ if (typeof webRootMap === 'string') {
		return no_webRoot(webRootMap);
	}

	app = parseCFG(webRoot, app);

	app.RC = new Ctrl('RC', webRootMap, null, app);

	return app._serverHandler;
}




// ---------------------
module.exports = create;
