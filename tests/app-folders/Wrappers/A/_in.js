module.exports = function (io) {
	io.res.write('/a-in');
	io.next();
};
