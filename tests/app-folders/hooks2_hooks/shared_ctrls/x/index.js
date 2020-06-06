module.exports = function (io) {

	io.res.write('x-index');

	io.next();

};
