module.exports = function (io) {
	io.res.write(this.configs);
	io.next();
};
