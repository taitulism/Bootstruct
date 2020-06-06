module.exports = function (io) {
	io.res.write('a-method');
	io.next();
};
