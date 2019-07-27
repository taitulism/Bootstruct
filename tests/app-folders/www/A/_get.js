module.exports = function (io) {
	io.res.write('g1');
	io.next();
};
