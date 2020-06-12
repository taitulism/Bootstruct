const has = require('./has');
const run = require('./run');


/*
  ┌────────────────────────────────────────────────────────────────
  │ examples:
  │     0. parentChain = [_in, runSub, _out]
  │     1. targetChain = [_in, runVerb, _out]
  │     2. methodChain = [_in, runMethod, _out]
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

	const _in = ctrl.in;

	if (_in) {
		targetChain.push(_in);
		methodChain.push(_in);
		parentChain.push(_in);
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

	const _out = ctrl.out;

	if (_out) {
		targetChain.push(_out);
		methodChain.push(_out);
		parentChain.push(_out);
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
