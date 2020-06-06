module.exports = function (io) {
	io.res.write('index');

	if (io.params[0] === 'whatever') io.res.write('whatever');

	io.next();
};
