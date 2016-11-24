'use strict';

const isEmpty = require('../../utils/is-empty');


/*
  ┌──────────────────────────────────────────────────────────────
  │ "delegate" means that when "noVerb" found for a ctrl, all of 
  │ its sub-ctrls will get it too (inherit behavior)
  │ unless they have a "noVerb" of their own.
 */
module.exports = {
	verbs (ctrl) {
		return !isEmpty(ctrl.verbs);
	},

	methods (ctrl) {
		let sharedMethods;

		const ownMethods = !isEmpty(ctrl.methods);

		if (ctrl.global.shared_methods) {
			sharedMethods = !isEmpty(ctrl.global.shared_methods);
		}

		return ownMethods || sharedMethods;
	},

	subCtrls (ctrl) {
		let sharedCtrls;

		const hasOwnCtrls = !isEmpty(ctrl.subCtrls);

		if (ctrl.global.shared_ctrls) {
			sharedCtrls = !isEmpty(ctrl.global.shared_ctrls);
		}

		return hasOwnCtrls || sharedCtrls;
	}
};
