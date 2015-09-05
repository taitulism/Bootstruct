module.exports = function(io) {

	if (io.ignore_failed) {
		io.res.end('FAIL!');
	}
	else {
		io.res.end('ignore');
	}

};