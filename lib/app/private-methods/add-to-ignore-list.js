'use strict';

const error    = require('../../errors');
const getProto = require('../../utils').getProto;

module.exports = function (app, item) {
	if (typeof item !== 'string') {
		return error.ignoreItemIsNotAString(item);
	}

	const ctrlHooksProto = getProto(app.hooks.ctrl);
	const hooksNames = Object.keys(ctrlHooksProto);

	item = item.toLowerCase();

	if (hooksNames.includes(item)) {
		return error.cannotIgnoreReservedEntryName(item);
	}

	app.ignoreList.push(item);
};
