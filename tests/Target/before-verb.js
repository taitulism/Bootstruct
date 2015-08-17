module.exports = function (io) {
	io.res.write('b4');
	io.next();
};