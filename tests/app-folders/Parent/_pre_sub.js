module.exports = function (io) {
	io.res.write('pre-sub');
	io.next();
};
