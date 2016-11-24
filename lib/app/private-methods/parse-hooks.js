'use strict';

const exists = require('fs').existsSync;

const error = require('../../errors');
const utils = require('../../utils');

const {forIn, f2j, normalizeEntryName} = utils;

module.exports = function (app) {
    const appHooks = app.hooks.app;

	if (exists(app.hooksFolderPath)) {
		app.hooksMap = f2j(app.hooksFolderPath);

		forIn(app.hooksMap.entries, (entryName, entryMap) => {
			entryName = normalizeEntryName(entryName, entryMap.type);

			if (entryName === 'io_init') {
				app.io_init = true;
			}
			if (appHooks[entryName]) {
				appHooks[entryName].call(app, entryMap);
			}
			else {
				if (!entryMap.type && !entryMap.entries['index.js']) {
					return error.expectingAnIndexFile(entryMap.path);
				}

				app[entryName] = require(entryMap.path);
			}
		});
	}
};
