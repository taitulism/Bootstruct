module.exports = function (io) {
	io.res.write('overriden');
	io.next();
};