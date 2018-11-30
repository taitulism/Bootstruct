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
	const ctrlProfile = io.states[ctrl.id];

	// don't increment chain index when debugging
	const i = incrementIndex ? ctrlProfile.index++ : ctrlProfile.index;

	const chainIndex = ctrlProfile.chainType;

	// get corresponding chain
	const chain = ctrl.chains[chainIndex];

	return chain[i];
};
