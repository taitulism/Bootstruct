module.exports = function (io) {
	io.res.write('a-method');

	if (io.params[0] === 'whatever' && io.params[1] === 'bro') {
		io.res.write('whatever-bro');
	}

	io.next();
};
