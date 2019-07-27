const {hasOwnProperty} = Object.prototype;

module.exports = function hasOwnProp (obj, prop) {
	return hasOwnProperty.call(obj, prop);
};
