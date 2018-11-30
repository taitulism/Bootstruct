module.exports = function (app) {
	if (this.req.url == '/') {
		this.res.write('exit');
	}

	this.res.end();
};
