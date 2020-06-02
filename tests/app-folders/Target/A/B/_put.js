module.exports = function (io) {
	io.res.write('b-put');
	io.next();
};
