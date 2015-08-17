module.exports = function (io) {
	io.res.write('b41');
	io.next();
};