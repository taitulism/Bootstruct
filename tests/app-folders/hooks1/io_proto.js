module.exports = function (io) {
	if (typeof io.qwe === 'function') {
		io.res.write(io.qwe());
	}

	io.res.end();
};
