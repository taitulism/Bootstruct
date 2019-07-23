module.exports = function (io) {
	io.res.write('ftr4');
	io.next();
};
