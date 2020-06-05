module.exports = function (io) {
	io.res.write('out');

	io.next();
};
