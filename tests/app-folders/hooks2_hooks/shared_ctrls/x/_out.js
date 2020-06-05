module.exports = function (io) {

	io.res.write('x-out');

	io.next();

};
