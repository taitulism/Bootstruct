module.exports = function (io) {
	io.res.write('ftr3');
	io.next();
};