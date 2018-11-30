module.exports = function(io){
	if (typeof this.qwe === 'function') {
		io.res.write(this.qwe());
	}

	io.res.end();
};
