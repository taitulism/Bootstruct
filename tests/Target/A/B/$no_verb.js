module.exports = function (io) {
	io.res.write('nvb');
	io.next();
};
