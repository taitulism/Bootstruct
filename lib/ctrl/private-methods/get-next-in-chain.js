'use strict';


/*
  ┌──────────────────────────────────────────────────────────────────────────
  │ ctrls has 3 chains of methods and uses only one of them per request.
  │
  │ io holds ctrl profiles with the index which represents the progress in 
  │ each chain.
  │
  │ by calling io.next() you increment that index.
  | 0 = PARENT (sub-ctrl)
  | 1 = TARGET
  | 2 = METHOD
 */
module.exports = function (ctrl, io, incrementIndex = true) {
	// get ctrl profile
	const profile = io._profiles[ctrl.id];

	// don't increment chain index when debugging
	const i = incrementIndex ? profile.idx++ : profile.idx;

	const chainIndex = profile.chainIndex;

	// get corresponding chain
	const chain = ctrl.chains[chainIndex];

	const nextInChain = chain[i];

	return nextInChain; 
};
