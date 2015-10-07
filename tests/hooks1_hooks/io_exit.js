module.exports = function (app) {
	this.res.end(this.exited || '');
};