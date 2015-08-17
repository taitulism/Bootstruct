module.exports = function (io) {
	io.res.write('b');
	io.next();
};