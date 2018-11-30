module.exports = function (io) {
	io.res.write(this.app.item);

	io.next();
};
