module.exports = function (io) {
	io.res.write('ftr1');
	io.next();
};