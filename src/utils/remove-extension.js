/*
 ┌─────────────────────────
 │ removes file extension
*/
module.exports = function removeExtension (name) {
	const lastDot = name.lastIndexOf('.');

	// at least 1 char before dot
	// nor a folder or a .dotFile
	if (lastDot >= 1) {
		name = name.substr(0, lastDot);
	}

	return name;
};
