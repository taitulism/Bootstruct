module.exports = function (io) {
	io.res.write('i');

	if (io.params[0] === 'bla') io.res.write('bla');

	io.next();
};
