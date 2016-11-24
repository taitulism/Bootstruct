'use strict'; 

/*
 ┌────────────────────────────────────────────────
 │ ctrl.id is its parent.id + /name.
 │ id is unique, name isn't.
 │ examples:
 │     id:   '/foo' │ '/foo/bar' │ '/foo/bar/foo'
 │     name: 'foo'  │ 'bar'      │ 'foo'
*/
module.exports = function (ctrl) {
	let buildID = '';

	// is RC? id = '/'
	if (!ctrl.name) return '/';

	// RC's direct child - avoid double slashes
	if (ctrl.parent && ctrl.parent.name) buildID += ctrl.parent.id;

	// all
	buildID += `/${ctrl.name}`;

	return buildID; 
};
