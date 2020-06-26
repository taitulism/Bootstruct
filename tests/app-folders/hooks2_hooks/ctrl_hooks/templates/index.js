// const {join} = require('path');

module.exports = function (tplObj) {
	// TODO: lost feature: custom hook
	// const cfgPath = join(entryMap.path, 'a-template.js');
	this.templates = tplObj;
};
