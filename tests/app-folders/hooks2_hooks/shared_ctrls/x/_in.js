module.exports = function (io) {

	io.res.write('x-in');

	io.next();

};
