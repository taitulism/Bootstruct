module.exports = function (io) {
	io.res.write('pre1');
	io.next();
};
