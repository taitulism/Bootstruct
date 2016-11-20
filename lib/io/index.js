'use strict';

const hasOwnProp = require('../utils/has-own-prop');

const NOT_FOUND_STATUS_CODE = require('../constants').NOT_FOUND_STATUS_CODE;

const {
    splitPath,
    setParams
} = require('./private-methods');


module.exports = function () {
	// ================
	//  IO Constructor
	// ================
	function IO (req, res) {
		this.req       = req;
		this.res       = res;
		this._profiles = Object.create(null);
		this.params    = splitPath(req.url);

		setParams(this);
	}

	IO.prototype = {
		constructor: IO,

		init      : null,
		_profiles : null,
		ctrl      : null,
		req       : null,
		res       : null,
		params    : null,
		_params   : null,

		next () {
			this.ctrl.next(this);
		},

         /*
		 | This function gets overriden by the "io.exit" hook.
		*/
		exit () {
			const res = this.res;

			if (res.finished) return;

			if (res.headersSent) {
				res.end(); 
			}
			else if (res._headers === null && !hasOwnProp(res, 'statusCode')) {

                /*
                 | "res._headers" is "null" untill "res.setHeader" is called.
                 | "res.statusCode" (own property) is "undefined" untill "res.write" is called.
                 | These two checks can tell that the response haven't been "touched" at all. 
                 | In this case, when no headers nor body have been set,
                 | Bootstruct responds with a "404 not found" by default.
                */
				res.writeHead(NOT_FOUND_STATUS_CODE, 'Not Found');
				res.end();
			}
		}
	};

	return IO;
};
