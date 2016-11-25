'use strict';

const getLoweredFirstParam = require('./get-lowered-first-param');
const isFunction           = require('../../utils/is-function');


/*
 ┌─────────────────────────────────────────────────────────────────────
 │ 	run = {
 │		.verb()    - on request (in chain)
 │		.method()  - on request (in chain)
 │		.subCtrl() - on request (in chain)
 │	}
 │	all 3 are being pushed to chains and called with: .call(this, io, ...io.params)
*/
module.exports = {
	verb (io) {
		const reqMethod = io.req.method.toLowerCase();
		const verbFn = this.verbs[reqMethod];

		if (isFunction(verbFn)) {
			verbFn.call(this, io, ...io.params);
		}
		else if (isFunction(this.noVerb)) {
			this.noVerb(io, ...io.params);
		}
		else {
			this.next(io);
		}
	},

	method (io) {
		const next   = getLoweredFirstParam(io);
		const method = this.methods[next];

		if (isFunction(method)) {
			// remove first item
			io.params.shift();

			method.call(this, io, ...io.params);
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
