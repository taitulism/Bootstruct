module.exports = function (io) {

	io.res.write('X2');

	io.next();

};
