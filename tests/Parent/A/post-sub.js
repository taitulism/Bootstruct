module.exports = function (io) {
	io.res.write('post1');
	io.next();
};