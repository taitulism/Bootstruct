module.exports = function (io) {
	io.res.write('l1');
	io.next();
};