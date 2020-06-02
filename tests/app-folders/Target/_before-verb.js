module.exports = function (io) {
	io.res.write('before-verb');
	io.next();
};
