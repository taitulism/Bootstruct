module.exports = function (io) {
	io.res.write('i2');
	io.next();
};
