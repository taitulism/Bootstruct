module.exports = function (io) {

	io.res.write('X1');
	
	io.next();

};