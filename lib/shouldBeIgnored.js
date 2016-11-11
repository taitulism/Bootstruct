'use strict';


function isNOTjs (name) {
	const lastDot = name.lastIndexOf('.');
	const ext     = name.substr(lastDot + 1);

	return ext.toLowerCase() !== 'js';
}


function matchStartWith (app, name) {
	const starterList    = app.ignoreStartWith;
	const starterListLen = starterList.length;

	for (let i = 0; i < starterListLen; i += 1) {
		const starter   = starterList[i];
		const nameStart = name.substr(0, starter.length);

		if (nameStart === starter) {
			return true;
		}
	}

	return false;
}


function isInIgnoreList (app, name) {
	if (app.ignoreList.length) {
		return app.ignoreList.includes(name);
	}

	return false;
}


module.exports = function (app, name, normalized, isFile) {
	if (isFile && isNOTjs(name)) return true;

	if (matchStartWith(app, normalized)) return true;

	if (isInIgnoreList(app, normalized)) return true;

	return false;
};
