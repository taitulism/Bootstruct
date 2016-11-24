'use strict';

module.exports = function (io) {
	const firstParam = io.params[0];

	if (!firstParam) return null;

	return firstParam.toLowerCase();
};
