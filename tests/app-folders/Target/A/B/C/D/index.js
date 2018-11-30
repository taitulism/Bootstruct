module.exports = function (io) {
	io.res.write('b44');
	io.next();
};
