'use strict';

const getLoweredFirstParam = require('./get-lowered-first-param');
const removeFirstParam     = require('../../io/private-methods').removeFirstParam;


/*
  ┌──────────────────────────────────────
  │ example:
  │ 	url:  /A/B/C
  │		on "RC" check-in:
  │ 		io.params = ['A','B','C']
  │
  │		on "A" ctrl check-in:
  │ 		io.params = ['B','C']
 */
module.exports = function (ctrl, io) {
	const first = getLoweredFirstParam(io);

	if (first && first === ctrl.name) {
		removeFirstParam(io);
	}
};
