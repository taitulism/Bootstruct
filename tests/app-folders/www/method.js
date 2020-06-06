module.exports = function (io) {
	io.res.write('method');
	io.next();
};
