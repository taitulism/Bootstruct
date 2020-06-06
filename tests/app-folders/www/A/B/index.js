module.exports = function (io) {
	io.res.write('b-index');
	io.next();
};
