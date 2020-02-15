const getLoweredFirstParam = require('./get-lowered-first-param');


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
module.exports = function removeSelfName (ctrl, io) {
	const first = getLoweredFirstParam(io);

	if (first && first === ctrl.name) {
    	// remove first item
		io.params.shift();
	}
};
