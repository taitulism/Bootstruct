module.exports = function (io) {
	io.res.write('a-pre-method');
	io.next();
};
