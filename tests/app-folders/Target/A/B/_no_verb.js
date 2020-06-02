module.exports = function (io) {
	io.res.write('b-no-verb');
	io.next();
};
