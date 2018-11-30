module.exports = function () {
	this.res.end(this.exited || '');
};
