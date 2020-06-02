module.exports = function (io) {
	io.res.write('b-get');
	io.next();
};
