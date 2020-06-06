module.exports = function (io) {
	io.res.write('/b-post-method');
	io.next();
};
