module.exports = function (objA, objB) {
	const AKeys = Object.keys(objA);
	const BKeys = new Set(Object.keys(objB));
	const dups = [];

	AKeys.forEach((key) => {
		if (BKeys.has(key)) {
			dups.push(key);
		}
	});

	return dups;
};
