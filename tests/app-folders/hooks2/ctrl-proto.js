module.exports = function (io) {
	if (typeof this.ctrl_proto_method_1 === 'function') {
		io.res.write(this.ctrl_proto_method_1());
	}

	if (typeof this.ctrl_proto_method_2 === 'function') {
		io.res.write(this.ctrl_proto_method_2());
	}

	io.next();
};
