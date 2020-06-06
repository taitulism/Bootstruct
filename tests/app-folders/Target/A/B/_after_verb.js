module.exports = function (io) {
	io.res.write('b-after-verb');
	io.next();
};
