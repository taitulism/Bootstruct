/* eslint-disable multiline-ternary */
module.exports = function (io) {
	io.res.write(this.hookThis ? 'ctrl-hook-this' : 'ctrl-hook-failed-this');
	io.res.write(this.hookArg ? 'ctrl-hook-arg' : 'ctrl-hook-failed-arg');
	io.res.write(this.public || 'ctrl-hook-no-public');

	io.res.end();
};
