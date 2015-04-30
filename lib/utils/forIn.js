module.exports = function (obj, fn) {
	var k;
	var hasOwn = Object.prototype.hasOwnProperty; 

	for (k in obj) {
		if (hasOwn.call(obj, k)) {
			fn.call(obj, k, obj[k]);
		}
	}
};
