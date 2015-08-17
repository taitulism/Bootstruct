module.exports = function (io) {
	io.res.write('l2');
	io.next();
};