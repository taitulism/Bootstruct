module.exports = function (io) {
	io.res.write('a-post-sub');
	io.next();
};
