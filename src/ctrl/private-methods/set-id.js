/*
 ┌────────────────────────────────────────────────
 │ ctrl.id is composed using it's parent.id:
 │     ctrl.id = "parent.id + / + own name"
 │ id is unique, name isn't.
 │ examples:
 │     name: 'foo'  │ 'bar'      │ 'foo'
 │     id:   '/foo' │ '/foo/bar' │ '/foo/bar/foo'
*/
module.exports = function setId (ctrl) {
	if (ctrl.isRootCtrl) return '/';

	const {parent} = ctrl;

	let tempId = `/${ctrl.name}`;

	/*
	 │	RC's ID is slash: '/'.
	 │	to avoid double starting slashes for RC's direct sub-ctrls like:
	 │	    ctrl.id = '//subCtrl'
	 │	the id will only start with the parent.id if current ctrl is
	 │	not RC nor RC's direct sub-ctrl
	*/
	const isNotRC       = !ctrl.isRootCtrl;
	const hasParent     = Boolean(parent);
	const parentIsNotRC = hasParent && !parent.isRootCtrl;

	if (isNotRC && parentIsNotRC) {
		tempId = parent.id + tempId;
	}

	return tempId;
};
