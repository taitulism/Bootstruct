/* eslint-disable camelcase */

module.exports = function (io) {
	io.res.write('ignore-failed');
	io.next();
};
