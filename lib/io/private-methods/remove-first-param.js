'use strict';

const setParams = require('./set-params');

module.exports = function (io) {
    io.params.shift();

    setParams(io);
};
