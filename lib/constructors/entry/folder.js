'use strict';

var root       = process.cwd();
var fs         = require('fs');
var sep        = require('path').sep;
var statSync   = fs.statSync;


/* EXPOSED */
/* Cunstructor */
function Folder (absPath) {
	this.absPath = absPath;
	
	// init instance
	this.init(absPath);
}

Folder.prototype.init = function(absPath) {
	this.stat    = statSync(absPath);
	this.type    = this.setType(this.stat);
	this.entries = this.readEntries(absPath);
	// this.pathObj = setPathObj(absPath, sep);
};

Folder.prototype.setType = function(stat) {
	if (stat.isDirectory()) {
		return 0; // 0 for a folder
	}
	else if (stat.isFile()) {
		return 1; // 1 for a file
	}
};

Folder.prototype.readEntries = function(absPath) {
	if (this.type === 0) {
		return fs.readdirSync(absPath);
	}

	throw 'folder lo tov';
};

// forEach entry
Folder.prototype.forEach = function(fn) {
 	var entries = this.entries;

	if (entries && this.type === 0) {
		entries.forEach(function (entry, i) {
			fn(entry, i);
		});
	}
};


// ----------------------------------
module.exports = function (absPath) {
	return new Folder(absPath);
};