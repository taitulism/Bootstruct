module.exports = function (io) {
	io.res.write('a1');
	io.next();
};
