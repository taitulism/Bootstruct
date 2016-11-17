module.exports = {
	GET: function (io) {
		io.res.write('get');
		io.next();
	},

	post: function (io) {
		io.res.write('post');
		io.next();
	}
};
