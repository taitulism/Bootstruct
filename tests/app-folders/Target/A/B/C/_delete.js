module.exports = function (io) {
	io.res.write('c-delete');
	io.next();
};
