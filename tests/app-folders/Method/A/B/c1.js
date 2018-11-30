module.exports = function (io) {
	io.res.write('c');
	io.next();
};
