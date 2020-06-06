module.exports = function (io) {
	io.res.write(this.config);
	io.next();
};
