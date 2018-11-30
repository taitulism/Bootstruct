module.exports = function (io) {
	if (typeof this.public === 'string') {
		io.res.write(this.public);
	}

	io.res.end();
};
