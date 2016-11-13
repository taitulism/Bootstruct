module.exports = function (io) {
	io.res.write(io.params.join(','));
	io.next();
};
