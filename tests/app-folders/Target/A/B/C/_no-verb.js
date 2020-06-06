module.exports = function (io) {
	io.res.write('c-no-verb');
	io.next();
};
