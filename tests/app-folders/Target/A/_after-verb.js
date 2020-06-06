module.exports = function (io) {
	io.res.write('a-after-verb');
	io.next();
};
