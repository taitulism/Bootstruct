module.exports = function (io) {
	io.res.write('/a-out');
	io.next();
};
