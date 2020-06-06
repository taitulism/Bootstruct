/* eslint-disable camelcase */

module.exports = {
	'a-shared-method' (io) {
		io.res.write('shared-method');
		io.next();
	},
};
