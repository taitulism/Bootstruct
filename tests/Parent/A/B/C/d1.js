module.exports = function (io) {
	io.res.write('d');
	io.next();
};
