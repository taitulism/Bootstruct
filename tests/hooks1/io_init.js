module.exports = function (io) {
	io.res.write(io.initiated);
	io.next();
};