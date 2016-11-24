'use strict'; 

const isRootCtrl = require('./is-root-ctrl');

module.exports = setID;


/*
 ┌────────────────────────────────────────────────
 │ ctrl.id is composed using it's parent.id:
 │     ctrl.id = "parent.id + / + own name"
 │ id is unique, name isn't.
 │ examples:
 │     name: 'foo'  │ 'bar'      │ 'foo'
 │     id:   '/foo' │ '/foo/bar' │ '/foo/bar/foo'
*/
function setID (ctrl) {
	if (isRootCtrl(ctrl)) return '/';

	let tempId = `/${ctrl.name}`;

	/*
		RC's ID is slash: '/'.
		to avoid double starting slashes for RC's direct sub-ctrls like: 
		    ctrl.id = '//subCtrl' 
		the id will only start with the parent.id if current ctrl is 
		not RC nor RC's direct sub-ctrl
	*/
	const isRC          = isRootCtrl(ctrl);
	const hasParent     = Boolean(ctrl.parent);
	const parentIsNotRC = hasParent && !isRootCtrl(ctrl.parent);

	if (!isRC && parentIsNotRC) {
		tempId = ctrl.parent.id + tempId;
	}

	return tempId;
}
