'use strict';


/*
  ┌──────────────────────────────────────────────────────────────
  │ "delegate" means that when "noVerb" found for a ctrl, all of 
  │ its sub-ctrls will get it too (inherit behavior)
  │ unless they have a "noVerb" of their own.
 */
module.exports = function (ctrl) {
	if (!ctrl.noVerb && ctrl.parent) {
		ctrl.noVerb = ctrl.parent.noVerb;
	}
};
