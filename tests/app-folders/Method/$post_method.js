module.exports = function (io) {
	io.res.write('post');
	io.next();
};
