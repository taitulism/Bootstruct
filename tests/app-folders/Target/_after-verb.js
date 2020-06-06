module.exports = function (io) {
	io.res.write('after-verb');
	io.next();
};
