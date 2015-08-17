module.exports = function (io) {
	io.res.write('ftr');
	io.next();
};