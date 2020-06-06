module.exports = function (io) {
	if (io.req.url === '/io-init') {
		const body = io.initiated ? 'io-initiated' : 'IO-NOT-INITIATED';

		io.res.write(body);
	}

	io.next();
};
