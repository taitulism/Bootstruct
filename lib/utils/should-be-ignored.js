'use strict';

function isNotJs (name) {
	const lastDot = name.lastIndexOf('.');
	const ext     = name.substr(lastDot + 1);

	return ext.toLowerCase() !== 'js';
}

function hasDotPrefix (name) {
	return name[0] === '.';
}

function isInIgnoreList (app, name) {
	if (!app.ignoreList) return false;

	return app.ignoreList.includes(name);
}

module.exports = function (app, name, normalized, isFile) {
	if (isFile && isNotJs(name)) return true;

	if (hasDotPrefix(name)) return true;

	if (isInIgnoreList(app, normalized)) return true;

	return false;
};
