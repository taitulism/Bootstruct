module.exports = function (io) {
	io.res.write('IGNORE_FAIL');
	io.next();
};