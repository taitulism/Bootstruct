module.exports = function (io) {
	io.res.write('in');
	io.next();
};
