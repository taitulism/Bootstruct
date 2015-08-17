module.exports = function (io) {
	io.res.write('put');
	io.next();
};