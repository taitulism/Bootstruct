module.exports = function (io) {
	if (io.ignore_failed) {
		io.res.write('IGNORE_FAIL!');
	}

	io.next();
};
