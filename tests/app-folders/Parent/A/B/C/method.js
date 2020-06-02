module.exports = function (io) {
	io.res.write('c-method');
	io.next();
};
