module.exports = function (io) {
	io.res.write('ptm1');
	io.next();
};
