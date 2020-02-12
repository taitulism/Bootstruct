const removeExt = require('./remove-extension');

/*
 ┌────────────────────────────────────────────────
 │ returns lowerCased extension-less entryname.
*/
module.exports = function normalizeEntryName (entryName, isFile = true) {
	const name = entryName.toLowerCase();

	return isFile
		? removeExt(name)
		: name;
};
