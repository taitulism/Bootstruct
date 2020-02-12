const hasOwnProp = require('./has-own-prop');

module.exports = function forIn (obj, fn) {
	for (const key in obj) {
		if (hasOwnProp(obj, key)) {
			fn.call(obj, key, obj[key]);
		}
	}
};
