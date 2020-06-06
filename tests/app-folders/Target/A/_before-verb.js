module.exports = function (io) {
	io.res.write('a-before-verb');
	io.next();
};
