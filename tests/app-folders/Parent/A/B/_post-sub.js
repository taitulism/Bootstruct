module.exports = function (io) {
	io.res.write('b-post-sub');
	io.next();
};
