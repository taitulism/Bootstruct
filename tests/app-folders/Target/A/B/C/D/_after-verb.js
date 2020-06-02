module.exports = function (io) {
	io.res.write('d-after-verb');
	io.next();
};
