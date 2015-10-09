'use strict';


var url   = require('url');
var forIn = require('./utils/forIn');

var hasOwn = Object.prototype.hasOwnProperty;



/*
  ┌──────────────────────────────────────────
  │ accepts a full url and returns an array
  │
  │ ignores qryStr
  │	merges repeating slashes
  │	trim preceding & trailing slashes
  │	split by /
  │
 */
function splitPath (url) {
	var len;

	// split by ? and take the first part
	var path = url.split('?')[0];

	// replace multi slashes with one
	path = path.replace(/\/{2,}/g, '/');

	// remove preceding slash
	path = path.substr(1);

	// remove trailing slash
	len = path.length;

	if (path.charAt(len - 1) == '/') {
		path = path.substring(0, len - 1);
	}

	return path.split('/');
}



// ---------------------------
module.exports = function () {
	// ================
	//  IO Constructor
	// ================
	function IO (req, res) {
		var self   = this;
		var method = req.method;

		this.req       = req;
		this.res       = res;
		this._profiles = Object.create(null);
		this.params    = splitPath(req.url);

		this.set_params();
	}

	IO.prototype = { constructor: IO,
		init      : null,
		_profiles : null,
		ctrl      : null,
		req       : null,
		res       : null,
		params    : null,
		_params   : null,

		next: function () {
			this.ctrl.next(this);
		},

		removeFirstParam: function () {
			this.params.shift();

			this.set_params();
		},

		set_params: function () {
			var ary = this.params.slice();

			ary.unshift(this);

			this._params = ary;
		},

		 /*
		 | This function gets overriden by the "io.exit" hook.
		*/
		exit: function () {
			var res = this.res;

			/* Deal Breaker */ if (res.finished) {return;}

			if (res.headersSent) {
				res.end(); 
			}
			else if ( res._headers === null && !Object.hasOwnProperty.call(res, 'statusCode') ) {
			 /*
			 | "res._headers" is "null" untill "res.setHeader" is called.
			 | "res.statusCode" (own property) is "undefined" untill "res.write" is called.
			 | These two checks can tell that the response haven't been "touched" at all. 
			 | In this case, when no headers nor body have been set,
			 | Bootstruct responds with a "404 not found" by default.
			*/
				res.writeHead(404, 'Not Found');
				res.end();
			}
		}
	};

	return IO;
};
