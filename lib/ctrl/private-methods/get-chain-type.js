const getLoweredFirstParam = require('./get-lowered-first-param');

const {
	PARENT_CHAIN_INDEX,
	TARGET_CHAIN_INDEX,
	METHOD_CHAIN_INDEX,
} = require('../../constants');


/*
  ┌────────────────────────────────────────────────────────────────────────────
  | test on checkIn, if this ctrl is the target ctrl for the current request.
  | checks if the next param is an existing sub
  |
  | returns
  | 	0 (parent)
  | 	1 (target)
  | 	2 (method)
 */
module.exports = function getChainType (ctrl, io) {
	const next = getLoweredFirstParam(io);

	if (next) {
		if (ctrl.methods[next]) {
			return METHOD_CHAIN_INDEX;
		}
		else if (ctrl.subCtrls[next]) {
			return PARENT_CHAIN_INDEX;
		}

		return TARGET_CHAIN_INDEX;
	}

	return TARGET_CHAIN_INDEX;
};
