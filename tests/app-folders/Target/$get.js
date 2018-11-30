module.exports = function (io) {
	io.res.write('get');
	io.next();
};
