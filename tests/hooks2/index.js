module.exports = function (io) {
	var body = '';

	// io_init
	body +=  (io.initiated) ? io.initiated + '-' : 'IO_INIT_FAIL-';

	// ctrl_proto
	body +=  (this.qwe) ? this.qwe() + '-' : 'CTRL_PROTO_FAIL_1-';
	body +=  (this.asd) ? this.asd() + '-' : 'CTRL_PROTO_FAIL_2-';

	// io_proto
	body +=  (io.qwe) ? io.qwe() + '-' : 'IO_PROTO_FAIL_1-';
	body +=  (io.asd) ? io.asd() + '-' : 'IO_PROTO_FAIL_2-';

	// entry_handlers
	body +=  (this.public) ? this.public + '-' : 'ENTRY_HANDLER_FAIL_1';
	body +=  (this.views)  ? this.views  + '-' : 'ENTRY_HANDLER_FAIL_2';

	body += (this.global.stuff) ? this.global.stuff.item : 'DEFAULT_HANDLER_FAIL';

	io.res.write(body);

	io.next();

};