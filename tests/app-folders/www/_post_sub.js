module.exports = function (io) {
	io.res.write('post-sub');
	io.next();
};
