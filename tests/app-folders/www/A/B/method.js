module.exports = function (io) {
	io.res.write('b-method');
	io.next();
};
