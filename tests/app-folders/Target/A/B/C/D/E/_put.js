module.exports = function (io) {
	io.res.write('e-put');
	io.next();
};
