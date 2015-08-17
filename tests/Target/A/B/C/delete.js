module.exports = function (io) {
	io.res.write('del');
	io.next();
};