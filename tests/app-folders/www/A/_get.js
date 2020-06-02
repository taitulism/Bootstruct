module.exports = function (io) {
	io.res.write('a-get');
	io.next();
};
