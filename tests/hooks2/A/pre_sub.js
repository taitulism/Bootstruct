module.exports = function (io) {
	io.res.write('{');

	io.next();
};