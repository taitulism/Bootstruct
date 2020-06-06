module.exports = function (io) {
	if (this.templates.length) {
		io.res.write(this.templates);
	}

	io.next();
};
