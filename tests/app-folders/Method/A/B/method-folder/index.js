module.exports = function (io) {
	io.res.write('/b-method-folder');

	io.next();
};
