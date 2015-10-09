module.exports = function (io) {

	io.res.write('X3');

	io.next();

};
