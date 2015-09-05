module.exports = function (io) {
	io.res.write('shared_m2');
	io.next();
};