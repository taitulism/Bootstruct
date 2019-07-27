module.exports = function (io) {
	io.res.write('prm1');
	io.next();
};
