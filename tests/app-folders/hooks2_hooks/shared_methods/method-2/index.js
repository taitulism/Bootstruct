module.exports = function (io) {
	io.res.write('shared_method-2');
	io.next();
};
