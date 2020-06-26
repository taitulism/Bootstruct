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

	const _in = ctrl.coreObj.in;

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

	const _out = ctrl.coreObj.out;

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
	if (ctrl.coreObj.index) {
		chain.push(ctrl.coreObj.index);
	}

	if (has.verbs(ctrl)) {
		chain.push(run.verb);
	}

	if (ctrl.coreObj.afterVerb) {
		chain.push(ctrl.coreObj.afterVerb);
	}
}

function setMethodChain (ctrl, chain) {
	if (ctrl.coreObj.preMethod) {
		chain.push(ctrl.coreObj.preMethod);
	}

	chain.push(run.method);

	if (ctrl.coreObj.postMethod) {
		chain.push(ctrl.coreObj.postMethod);
	}
}

function setParentChain (ctrl, chain) {
	if (ctrl.coreObj.preSub) {
		chain.push(ctrl.coreObj.preSub);
	}

	chain.push(run.subCtrl);

	if (ctrl.coreObj.postSub) {
		chain.push(ctrl.coreObj.postSub);
	}
}
