var resolve   = require('path').resolve;
var parseCtrl = require('./lib/parseCtrl');
var Ctrl      = require('./lib/constructors/ctrl');
var IO        = require('./lib/constructors/io');
var f2j       = require('./lib/utils/f2j');

// --------------------------------
module.exports = (function () {
	var folderMap = f2j(resolve('app'));
	var ctrlObj   = parseCtrl(folderMap);

	//  Root Ctrl
	var RC = new Ctrl(ctrlObj, 'RC');

	var bts = function (req, res) {
		var io = new IO(req, res);

		io = RC.checkIn(io);
	};

	return bts;
})();