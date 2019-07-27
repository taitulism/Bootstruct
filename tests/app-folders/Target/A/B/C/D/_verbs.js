module.exports = {
	GET (io) {
		io.res.write('get');
		io.next();
	},

	post (io) {
		io.res.write('post');
		io.next();
	},
};
