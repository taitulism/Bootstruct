'use strict';

module.exports = function (app, fn) {
	if (fn) {
		app.requestHandler = fn;
	}
	else if (app.io_init) {
		app.requestHandler = (req, res) => {
			const io = new app.IO(req, res);

			io.init(app);
		};
	}
	else {
		app.requestHandler = (req, res) => {
			const io = new app.IO(req, res);

			app.RC.checkIn(io);
		};
	}

	app.requestHandler.app = app;
};
