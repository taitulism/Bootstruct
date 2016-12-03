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
			const ioParams = io.params;

			// remove first item like in ctrl.check-in
			ioParams.shift();

			const methodParams = method.params;
			const runParams    = methodParams 
				? matchParams(methodParams, ioParams)
				: ioParams;

			method.call(this, io, ...runParams);
		}
	},

	subCtrl (io) {
		const next    = getLoweredFirstParam(io);
		const subCtrl = this.subCtrls[next];

		if (subCtrl) {
			subCtrl.parent = this;
			subCtrl.checkIn(io);
		} 
	}
};


/*
 ┌─────────────────────────────────────────────────────────────────────────────
 │	smart matching params for key-value urls (e.g. /bookId/13/chapter/22).
 │  returns a new params array, based on method.params (init) & io.params (request).
 │ 	it loops over the method's params (e.g. function (a, b, c)...)
 │ 	if a param found in request - push its value.
 │  single values like "bla" in "/a/1/bla/b/2" will be pushed last.
 │	each key-value pair is removed from the "workingCopy" (a copy of io.params array)
 │ 	until all there is left in the "workingCopy" are the single values.
 │
 │	without param matching:
 │ 	method: function (io, bookId, value_1, chapter, value_2) {
 │		// bookId  = 'bookId'  (always)
 │		// value_1 = 13        (dynamic)
 │		// chapter = 'chapter' (always)
 │		// value_2 = 22        (dynamic)
 │	}
 │
 │	with param matching:
 │ 	method: function (io, $bookId, $chapter) {
 │		// $bookId  = 13
 │		// $chapter = 22
 │	}
*/
function matchParams (methodParams, ioParams) {
	// a copy of io.params
	const workingCopy = ioParams.slice(0);

	// the returned value
	const params = [];

	const len = methodParams.length;

	for (let i = 0; i < len; i += 1) {
		const param = methodParams[i];
		const isRequested = ioParams.includes(param);

		if (isRequested) {
			// index in io.params
			const index = workingCopy.indexOf(param);
			const next  = workingCopy[index + 1];

			if (next) {
				const nextIsTheValue = !methodParams.includes(next);

				if (nextIsTheValue) {
					params.push(next);
					workingCopy.splice(index, 2);
				}
				else {
					params.push(true);
					workingCopy.splice(index, 1);
				}
			}
			else {
				params.push(true);
				workingCopy.splice(index, 1);
			}
		}
		else {
			params.push(null);
		}
	}

	return [...params, ...workingCopy];
}
