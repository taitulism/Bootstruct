module.exports = function (io) {
	io.res.write('a-no-verb');
	io.next();
};
