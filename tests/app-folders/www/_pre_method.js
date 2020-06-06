module.exports = function (io) {
	io.res.write('pre-method');
	io.next();
};
