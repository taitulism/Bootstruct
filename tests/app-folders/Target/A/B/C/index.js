module.exports = function (io) {
	io.res.write('c-index');
	io.next();
};
