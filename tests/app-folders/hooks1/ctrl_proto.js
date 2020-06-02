module.exports = function (io) {
	if (typeof this.customMethod === 'function') {
		io.res.write(this.customMethod());
	}

	io.res.end();
};
