'use strict';

var ioProto;
var url = require('url');

var hasOwn = Object.hasOwnProperty;


// ================
//  IO Constructor 
// ================
function IO (req, res) {
	var self   = this;
	var method = req.method;

	this._profiles = {};
	this.req       = req;
	this.res       = res;
	this.VERB      = method;
	this.method    = method.toLowerCase();
	
	// split path and a copy
	this._params = splitPath(req.url);
	this.params  = this._params.slice(0);
}


/*──────────────────────────────────────────
 │ accepts a full url and returns an array
 │ 
 │ how: ignores qryStr
 │		merges repeating slashes
 │		trim preceding & trailing slashes
 │		split by /
 │
 │ used by: IO constructor
*/

function splitPath (url) {
	var len;

	// split by ? and take the first
	var path = url.split('?')[0]; 

	// replace multi slashes with one
	path = path.replace(/\/{2,}/g, '/');

	// remove preceding slash
	path = path.substr(1);
				
	// remove trailing slash
	len = path.length;

	if(path.charAt(len - 1) == '/') {
		path = path.substring(0, len - 1); 
	}

	return path.split('/');
}


// --------------------
ioProto = IO.prototype;
// --------------------


ioProto._getProfile = function(ctrlID) {
	ctrlID = ctrlID || this._ctrl.id;

	if (hasOwn.call(this._profiles, ctrlID)) {
		return this._profiles[ctrlID];
	}

	this._profiles[ctrlID] = {};
	
	return this._profiles[ctrlID];
};

ioProto._setProfile = function(profile, ctrlID) {
	ctrlID = ctrlID || this._ctrl.id;
	
	this._profiles[ctrlID] = profile;
};

ioProto.next = function() {
	this._ctrl.handle(this);
};


// -----------------
module.exports = IO;