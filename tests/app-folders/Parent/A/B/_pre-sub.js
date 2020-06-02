module.exports = function (io) {
	io.res.write('b-pre-sub');
	io.next();
};
