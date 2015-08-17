module.exports = function (io) {
	io.res.write('nva');
	io.next();
};