var resolve   = require('path').resolve;
var parseCtrl = require('./lib/parseCtrl');
var Ctrl      = require('./lib/constructors/ctrl');
var IO        = require('./lib/constructors/io');
var f2j       = require('./lib/utils/f2j');

//setup
var folderMap = f2j(resolve('app'));
var ctrlObj   = parseCtrl(folderMap);
var RC        = new Ctrl(ctrlObj, 'RC');


module.exports = function bootstruct(req, res) {
	return RC.checkIn(new IO(req, res));
};
