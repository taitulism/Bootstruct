module.exports = function (io) {
	io.res.write(this.templates['a-template']);
	io.next();
};
