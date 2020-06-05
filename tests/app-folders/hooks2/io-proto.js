module.exports = function (io) {
	if (typeof io['proto-method-1'] === 'function') {
		io.res.write(io['proto-method-1']());
	}

	if (typeof io['proto-method-2'] === 'function') {
		io.res.write(io['proto-method-2']());
	}

	io.next();
};
