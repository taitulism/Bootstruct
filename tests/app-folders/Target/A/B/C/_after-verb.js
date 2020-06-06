module.exports = function (io) {
	io.res.write('c-after-verb');
	io.next();
};
