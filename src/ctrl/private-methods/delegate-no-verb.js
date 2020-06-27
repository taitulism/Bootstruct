/*
  ┌──────────────────────────────────────────────────────────────
  │ "delegate" means that when "noVerb" found for a ctrl, all of
  │ its sub-ctrls will get it too (inherit behavior)
  │ unless they have a "noVerb" of their own.
 */
module.exports = function delegateNoVerb (ctrl) {
	if (!hasNoVerb(ctrl) && ctrl.parent && hasNoVerb(ctrl.parent)) {
		ctrl.coreObj.verbs.noVerb = ctrl.parent.coreObj.verbs.noVerb;
	}
};

function hasNoVerb (ctrl) {
	return ctrl.coreObj.verbs && ctrl.coreObj.verbs.noVerb;
}
