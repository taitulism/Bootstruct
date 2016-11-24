'use strict';

const getChainIndex = require('./get-chain-index');

module.exports = function (ctrl, io) {
	io._profiles[ctrl.id] = {
        idx        : 0,
        chainIndex : getChainIndex(ctrl, io)
    };
};
