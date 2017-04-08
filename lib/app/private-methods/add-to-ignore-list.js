'use strict';

const error = require('../../errors');

module.exports = function (app, item) {
	if (typeof item !== 'string') {
		return error.ignoreItemIsNotAString(item);
	}

	const hooksNames = Object.keys(app.ctrl_proto);

	item = item.toLowerCase();

	if (hooksNames.includes(item)) {
		return error.cannotIgnoreReservedEntryName(item);
	}

	app.ignoreList.push(item);
};
