module.exports = function (io) {
	io.res.write('a-pre-sub');

	io.next();
};
