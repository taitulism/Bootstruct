module.exports = function (io) {
	io.exited = 'io_exit';
	io.next();
};
