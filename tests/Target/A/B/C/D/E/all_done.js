module.exports = function (io) {
	io.res.write('ftr5');
	io.next();
};
