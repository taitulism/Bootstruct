module.exports = function (io) {
	io.res.write('prm');
	io.next();
};