/* eslint-disable camelcase */

module.exports = {
	a_shared_method (io) {
		io.res.write('shared_method');
		io.next();
	},
};
