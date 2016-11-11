'use strict';

module.exports = function (obj, fn) {
	const hasOwn = Object.prototype.hasOwnProperty; 

	for (const key in obj) {
		if (hasOwn.call(obj, key)) {
			fn.call(obj, key, obj[key]);
		}
	}
};
