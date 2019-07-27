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
module.exports = function setupChains (ctrl) {
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
	setTargetChain(ctrl, targetChain);

	// methodChain
	if (has.methods(ctrl)) {
		setMethodChain(ctrl, methodChain);
	}

	// parentChain
	if (has.subCtrls(ctrl)) {
		setParentChain(ctrl, parentChain);
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
	return [parentChain, targetChain, methodChain];
};

function setTargetChain (ctrl, chain) {
	if (ctrl.index) {
		chain.push(ctrl.index);
	}

	if (has.verbs(ctrl)) {
		chain.push(run.verb);
	}

	if (ctrl.afterVerb) {
		chain.push(ctrl.afterVerb);
	}
}

function setMethodChain (ctrl, chain) {
	if (ctrl.preMethod) {
		chain.push(ctrl.preMethod);
	}

	chain.push(run.method);

	if (ctrl.postMethod) {
		chain.push(ctrl.postMethod);
	}
}

function setParentChain (ctrl, chain) {
	if (ctrl.preSub) {
		chain.push(ctrl.preSub);
	}

	chain.push(run.subCtrl);

	if (ctrl.postSub) {
		chain.push(ctrl.postSub);
	}
}
