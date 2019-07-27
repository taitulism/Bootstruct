module.exports = function (io) {
	io.res.write('g2');
	io.next();
};
