'use strict';

var $fs        = require('fs');
var	$path      = require('path');
var	read       = $fs.readFile;
var	write      = $fs.writeFile;
var	unlink     = $fs.unlink;

function File (absPath, encoding) {
	this.absPath  = absPath;
	this.encoding = encoding || 'utf8';
}

File.prototype.exists = function() {
	return $fs.existsSync(this.absPath);
};

File.prototype.ifExists = function(sxs, fail) {
	var self = this;

	$fs.exists(this.absPath, function (exists) {
		if (exists) {
			sxs.call(self);
		}
		else {
			fail.call(this);
		}
	});
};

File.prototype.getContents = function(sxs, fail) {
	read(this.absPath, function(err, data) {
		if (!err) {
			sxs(data);
			return;
		}

		fail && fail(err);
	});
};

File.prototype.create = function(sxs, fail) {
	var options = {
		encoding: 'utf8', 
		mode: 438
	};
	
	write(this.absPath, '', options, function (err) {
		if (!err) {
			sxs && sxs();
			return;
		}

		fail && fail(err);
	});
};

File.prototype.write = function(txt, sxs, fail) {
	write(this.absPath, txt, {
			encoding: 'utf8',
			mode: 438,
		}, 
		function (err) {
			if (!err) {
				sxs && sxs();
				return;
			}

			fail && fail(err);
	});
};

File.prototype.delete = function(sxs) {
	unlink(this.absPath, sxs);
};


// ---------------------------------------------------------
module.exports = function (absPath, encoding) {
	return new File(absPath, encoding);
};
