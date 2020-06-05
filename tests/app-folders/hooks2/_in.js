module.exports = function (io) {
	if (io.req.url === '/io-init') {
		const body = io.initiated ? 'io-initiated' : 'io-not-initiated';
		io.res.end(body);
		return;
	}

	io.res.write('in');
	io.next();
};
