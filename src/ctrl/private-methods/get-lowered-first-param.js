module.exports = function getLoweredFirstParam (io) {
	const [firstParam] = io.params;

	if (!firstParam) return null;

	return firstParam.toLowerCase();
};
