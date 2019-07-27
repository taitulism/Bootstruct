const forIn = require('../../utils/for-in');

module.exports = function initSubCtrl (ctrl) {
	const {subCtrls} = ctrl;

	forIn(subCtrls, (name, subCtrlMap) => {
		// this ctrl is passed as a parent
		subCtrls[name] = new ctrl.constructor(name, subCtrlMap, ctrl);
	});

	return subCtrls;
};
