module.exports = function (io) {
	io.res.write('ftr2');
	io.next();
};