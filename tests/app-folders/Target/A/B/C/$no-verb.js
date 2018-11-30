module.exports = function (io) {
	io.res.write('nvc');
	io.next();
};
