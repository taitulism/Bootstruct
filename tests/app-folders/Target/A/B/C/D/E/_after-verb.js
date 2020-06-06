module.exports = function (io) {
	io.res.write('e-after-verb');
	io.next();
};
