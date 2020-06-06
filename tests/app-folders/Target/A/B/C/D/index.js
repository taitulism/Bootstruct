module.exports = function (io) {
	io.res.write('d-index');
	io.next();
};
