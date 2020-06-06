module.exports = function (io) {
	io.res.write('shared_method-1');
	io.next();
};
