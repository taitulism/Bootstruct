module.exports = function (io) {
	io.res.write('b-out');
	io.next();
};
