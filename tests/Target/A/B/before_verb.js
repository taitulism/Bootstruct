module.exports = function (io) {
	io.res.write('b42');
	io.next();
};