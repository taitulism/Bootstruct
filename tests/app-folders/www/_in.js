module.exports = function (io) {
	io.res.write('f');
	io.next();
};
