'use strict';

const has = require('./has');
const run = require('./run');


/*
  ┌────────────────────────────────────────────────────────────────
  │ examples:
  │     0. parentChain = [$in, runSub, $out]
  │     1. targetChain = [$in, runVerb, $out]
  │     2. methodChain = [$in, runMethod, $out]
  │
  │ "setupChains" fn creates an array of 3 chains (3 arrays) of 
  │ methods to run for each case.
  │ this.chains = [[...],[...],[...]];
  │
 */
module.exports = function (ctrl) {
	const targetChain = [];
	const methodChain = [];
	const parentChain = [];

	const $in = ctrl.in;

	if ($in) {
		targetChain.push($in);
		methodChain.push($in);
		parentChain.push($in);
	}

	// targetChain
	if (ctrl.index) {
		targetChain.push(ctrl.index);
	}

	if (has.verbs(ctrl)) {
		targetChain.push(run.verb);
	}

	if (ctrl.afterVerb) {
		targetChain.push(ctrl.afterVerb);
	}

	// methodChain
	if (has.methods(ctrl)) {
		if (ctrl.preMethod) {
			methodChain.push(ctrl.preMethod);
		}

		methodChain.push(run.method);

		if (ctrl.postMethod) {
			methodChain.push(ctrl.postMethod);
		}
	}

	// parentChain
	if (has.subCtrls(ctrl)) {
		if (ctrl.preSub) {
			parentChain.push(ctrl.preSub);
		}

		parentChain.push(run.subCtrl);

		if (ctrl.postSub) {
			parentChain.push(ctrl.postSub);
		}
	}

	const $out = ctrl.out;

	if ($out) {
		targetChain.push($out);
		methodChain.push($out);
		parentChain.push($out);
	}

	// 0: parentChain
	// 1: targetChain
	// 2: methodChain
	ctrl.chains = [parentChain, targetChain, methodChain];
};
