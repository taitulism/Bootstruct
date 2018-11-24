'use strict';

const getChainType = require('./get-chain-type');

module.exports = function (ctrl, io) {
	io.states[ctrl.id] = {
        chainType : getChainType(ctrl, io),
        index     : 0
    };
};
