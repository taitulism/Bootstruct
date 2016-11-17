module.exports = function (io) {
	io.res.write('pre');
	io.next();
};
