module.exports = function (io) {
	if (typeof io.customMethod === 'function') {
		io.res.write(io.customMethod());
	}

	io.next();
};
