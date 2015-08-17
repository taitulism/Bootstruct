module.exports = function (io) {
	io.res.write('ptm');
	io.next();
};