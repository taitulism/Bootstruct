'use strict';


/*
  ┌────────────────────────────────────────────────
  │ returns lowerCased extension-less entryname.
 */
function normalizeEntryName (entryName, isFile) {
	var name = entryName.toLowerCase();

	return (isFile) ? removeExt(name) : name;
}

/*
  ┌─────────────────────────
  │ removes file extension
 */
function removeExt (entry) {
	var lastDot = entry.lastIndexOf('.');

	return entry.substr(0, lastDot);
}




// ----------------------------------------------------
module.exports = normalizeEntryName;