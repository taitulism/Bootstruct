module.exports = function (io) {
	io.res.write('/b-in');
	io.next();
};
