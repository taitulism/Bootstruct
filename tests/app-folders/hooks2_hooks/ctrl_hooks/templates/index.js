const {join} = require('path');

module.exports = function (entryMap) {
	const cfgPath = join(entryMap.path, 'a-template.js');
	this.templates = require(cfgPath);
};
