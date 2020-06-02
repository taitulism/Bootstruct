module.exports = function (io) {
	io.res.write('a-post');
	io.next();
};
