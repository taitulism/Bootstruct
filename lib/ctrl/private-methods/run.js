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

			const methodParams = method.params;

			const params = doStuff(methodParams, io.params);

			console.log(params);

			method.call(this, io, ...params);
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

function doStuff (methodParams, ioParams) {
	const len = ioParams.length;
	const params = [];

	for (let i = 0; i < len; i += 1) {
		const evenIndex = i * 2;
		const oddIndex  = evenIndex + 1;

		const ioEvenParam = ioParams[evenIndex];
		const ioOddParam  = ioParams[oddIndex];
		const methodParam = methodParams[i];
		const nextMethodParam = methodParams[evenIndex];


		if (isExpectedParam(ioEvenParam, methodParam) && 
			isValueExists(ioOddParam) && 
			isValueNotExpectedParam(ioOddParam, nextMethodParam)
			) {
			params.push(ioOddParam);
		}
		else {
			params.push(ioEvenParam);
		}
	}
	
	return params;
}

function isExpectedParam (ioParam, methodParam) {
	return ioParam === methodParam;
}

function isValueExists (value) {
	return Boolean(value);
}

function isValueNotExpectedParam (value, nextExpectedParam) {
	return value !== nextExpectedParam;
}


/*

method [min, max]
io     [min, 1, max, 2]
params [1]
*/


