module.exports = function (io) {
	io.res.write('b43');
	io.next();
};
