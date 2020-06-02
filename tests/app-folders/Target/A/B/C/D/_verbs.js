module.exports = {
	GET (io) {
		io.res.write('d-get');
		io.next();
	},

	post (io) {
		io.res.write('d-post');
		io.next();
	},
};
