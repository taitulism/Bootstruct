module.exports = function (io) {
	io.res.write('e-get');
	io.next();
};
