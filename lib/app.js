'use strict';


var exists             = require('fs').existsSync;
var resolve            = require('path').resolve;
var map                = require('./utils/f2j');
var forIn              = require('./utils/forIn');
var Ctrl               = require('./ctrl');
var normalizeEntryName = require('./entryHandlers/utils').normalizeEntryName;
var webRootHandlers    = require('./entryHandlers/web-root');
var CFGHandlers        = require('./entryHandlers/cfg');


var hasOwn = Object.prototype.hasOwnProperty;


function create (webRoot) {
	var cfg, resolved_webRoot, resolved_cfg, webRootMap, cfgMap;
	
	// app
	var app = Object.create(null);
	
	app.ctrls = Object.create(null);
	
	// set folder names
	webRoot = webRoot || 'www';
	cfg     = webRoot + '_cfg';

	// resolve folder names
	resolved_webRoot = resolve(webRoot);
	resolved_cfg     = resolve(cfg);


	/* Deal Breaker */ if (!exists(resolved_webRoot)) {
		return no_webRoot(resolved_webRoot);
	}


	// map web-root folder (f2j)
	webRootMap = map(resolved_webRoot);

	if (exists(resolved_cfg)) {

		// map cfg folder (f2j)
		cfgMap = map(resolved_cfg);

		forIn(cfgMap.entries, function (entryName, entryMap) {
			entryName = normalizeEntryName(entryName, entryMap.type);

			if (hasOwn.call(CFGHandlers, entryName)) {
				CFGHandlers[entryName].call(app, entryMap);
			}
			else {
				app[entryName] = require(entryMap.path);
			}
		});
	}

	app.RC = new Ctrl(webRootMap, 'RC', null, app, true);

	return app;
}


function no_webRoot (resolved_webRoot) {
	console.log("Bootstruct couldn't find your web-root folder: ");
	console.log('    ' + resolved_webRoot);

	return function (req, res) {
		res.end("Bootstruct couldn't find your web-root folder.");
	};
}

// ---------------------
module.exports = create;