'use strict';

const removeFirstParam = require('../../io/private-methods').removeFirstParam;
const {isFunction}     = require('../../utils');
const getLoweredFirstParam     = require('./get-lowered-first-param');


/*
 ┌─────────────────────────────────────────────────────────────────────
 │ 	run = {
 │		.verb()    - on request (in chain)
 │		.method()  - on request (in chain)
 │		.subCtrl() - on request (in chain)
 │	}
 │	all 3 are being pushed to chains and called with: .apply(this, io._params)
*/
module.exports = {
	verb (io) {
		const reqMethod = io.req.method.toLowerCase();
		const verbFn = this.verbs[reqMethod];

		if (isFunction(verbFn)) {
			verbFn.apply(this, io._params);
		}
		else if (isFunction(this.noVerb)) {
			this.noVerb(...io._params);
		}
		else {
			this.next(io);
		}
	},

	method (io) {
		const next   = getLoweredFirstParam(io);
		const method = this.methods[next];

		if (isFunction(method)) {
			removeFirstParam(io);

			method.apply(this, io._params);
		}
	},

	subCtrl (io) {
		const next = getLoweredFirstParam(io);
		const subCtrl = this.subCtrls[next];

		if (subCtrl) {
			subCtrl.parent = this;
			subCtrl.checkIn(io);
		} 
	}
};
