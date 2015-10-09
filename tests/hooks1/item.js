module.exports = function (io) {
	io.res.write(this.global.item);

	io.next();
};
