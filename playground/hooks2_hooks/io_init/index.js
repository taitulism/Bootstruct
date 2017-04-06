module.exports = function (app) {
	var self = this;

	this.initiated = 'io_init';

	setTimeout(function () {
		app.checkIn(self);
	}, 0);

};
