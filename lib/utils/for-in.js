'use strict';

const hasOwnProp = require('./has-own-prop');

module.exports = function (obj, fn) {
	for (const key in obj) {
		if (hasOwnProp(obj, key)) {
			fn.call(obj, key, obj[key]);
		}
	}
};
