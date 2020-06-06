module.exports = function (io) {
	io.res.write('post-method');
	io.next();
};
