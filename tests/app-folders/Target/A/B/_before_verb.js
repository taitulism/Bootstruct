module.exports = function (io) {
	io.res.write('b-before-verb');
	io.next();
};
