module.exports = function (io) {
	io.res.write('/a-post-method');
	io.next();
};
