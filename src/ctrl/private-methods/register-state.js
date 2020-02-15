const getChainType = require('./get-chain-type');

module.exports = function registerState (ctrl, io) {
	io.states[ctrl.id] = {
		index: 0,
		chainType: getChainType(ctrl, io),
	};
};
