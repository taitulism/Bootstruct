module.exports = function (io) {
	io.res.write('b-pre-method');
	io.next();
};
