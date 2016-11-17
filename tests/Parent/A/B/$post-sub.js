module.exports = function (io) {
	io.res.write('post2');
	io.next();
};
