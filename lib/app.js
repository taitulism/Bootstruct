'use strict';


var exists             = require('fs').existsSync;
var resolve            = require('path').resolve;
var map                = require('./utils/f2j');
var forIn              = require('./utils/forIn');
var Ctrl               = require('./ctrl');
var normalizeEntryName = require('./entryHandlers/normalize');

var webRootHandlers = require('./entryHandlers/web-root');

var hasOwn = Object.prototype.hasOwnProperty;



function create (CFGFolderName, webRootMap) {
	var resolvedPath, cfgMap;

	var app = {};

	// "Bootstruct Global Scope" or "BackGround Scope"
	CFGFolderName = CFGFolderName || 'BGS';

	resolvedPath = resolve(CFGFolderName);

	if (exists(resolvedPath)) {
		cfgMap = map(resolvedPath);
	
		forIn(cfgMap.entries, function (entryName, entryMap) {
			entryName = normalizeEntryName(entryName, entryMap.type);
			
			app[entryName] = require(entryMap.path);
		});
	}

	app.RC = new Ctrl(webRootMap, 'RC', null, app);

	return app;
}



// ---------------------
module.exports = create;