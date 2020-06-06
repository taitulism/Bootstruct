module.exports = function (io) {
	io.res.write('a-index');
	io.next();
};
