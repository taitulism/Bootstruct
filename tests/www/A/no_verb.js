module.exports = function (io) {
	io.res.write('nv');
	io.next();
};