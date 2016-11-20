'use strict';

module.exports = function (app, fn) {
	if (fn) {
		app.serverHandler = fn;
	}
	else if (app.io_init) {
		app.serverHandler = (req, res) => {
			const io = new app.IO(req, res);

			io.init(app);
		};
	}
	else {
		app.serverHandler = (req, res) => {
			const io = new app.IO(req, res);

			app.RC.checkIn(io);
		};
	}

	app.serverHandler.global = app;
};
