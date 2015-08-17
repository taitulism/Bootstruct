module.exports = function (io) {
	io.res.write('pre2');
	io.next();
};