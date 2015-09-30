module.exports = function (io) {
	io.res.end(this.global.item);

	io.next();
};