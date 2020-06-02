module.exports = function (io) {
	io.res.write('e-post');
	io.next();
};
