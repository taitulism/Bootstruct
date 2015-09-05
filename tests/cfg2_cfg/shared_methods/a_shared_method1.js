module.exports = function (io) {
	io.res.write('shared_m1');
	io.next();
};