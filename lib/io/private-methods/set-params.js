'use strict';

module.exports = function (io) {
    const ary = io.params.slice();

    ary.unshift(io);

    io._params = ary;
};
