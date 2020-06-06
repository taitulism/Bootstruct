module.exports = function (io) {
	io.exited = 'io-exit';
	io.next();
};
