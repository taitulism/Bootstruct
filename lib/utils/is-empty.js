module.exports = function isEmpty (obj) {
	const keys = Object.keys(obj);

	return keys.length === 0;
};
