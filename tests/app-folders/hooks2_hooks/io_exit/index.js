module.exports = function () {
	if (this.req.url === '/') {
		this.res.write('exit');
	}

	this.res.end();
};
