module.exports = function (io) {
	io.res.write('g');
	io.next();
};
