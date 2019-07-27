const getChainType = require('./get-chain-type');

module.exports = function registerState (ctrl, io) {
	io.states[ctrl.id] = {
		chainType: getChainType(ctrl, io),
		index:     0,
	};
};
