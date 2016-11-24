'use strict';


/*
  ┌──────────────────────────────────────────────────────────────────────────
  │ ctrls has 3 chains of methods and uses only one of them per request.
  │
  │ io holds ctrl profiles with the index which represents the progress in 
  │ each chain.
  │
  │ by calling io.next() you increment that index.
 */
module.exports = function (ctrl, io, incrementIndex = true) {
	// get ctrl profile
	const profile = io._profiles[ctrl.id];

	// increment chain index (when debugging - don't)
	const i = incrementIndex ? profile.idx++ : profile.idx;

	// is target? 0: sub, 1: target, 2: method
	const chainIndex = (profile.chainIndex);

	// get corresponding chain
	const chain = ctrl.chains[chainIndex];

	const nextInChain = chain[i];

	return nextInChain; 
};
