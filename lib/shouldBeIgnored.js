'use strict';


function isNOTjs (name) {
	var lastDot = name.lastIndexOf('.');
	var ext     = name.substr(lastDot + 1);

	return ext.toLowerCase() != 'js';
}


function matchStartWith (app, name) {
	var starter, nameStart, i;
	var starterList    = app.ignoreStartWith;
	var starterListLen = starterList.length;

	for (i = 0; i < starterListLen; i+=1) {
		starter   = starterList[i];
		nameStart = name.substr(0, starter.length);

		if (nameStart === starter) {
			return true;
		}
	}

	return false;
}


function isInIgnoreList (app, name) {
	if (app.ignoreList.length) {
		return ~app.ignoreList.indexOf(name);
	}

	return false;
}


module.exports = function shouldBeIgnored (app, name, normalized, isFile) {
	if ( isFile && isNOTjs(name)         ) return true;

	if ( matchStartWith(app, normalized) ) return true;

	if ( isInIgnoreList(app, normalized) ) return true;

	return false;
};
