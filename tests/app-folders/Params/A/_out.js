module.exports = function (io) {
	const params = io.params.join(',');

	io.res.write(`${params}|`);
	io.next();
};
