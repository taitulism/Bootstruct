module.exports = function (app) {
	this.initiated = 'io_init';

	setTimeout(() => {
		app.checkIn(this);
	}, 0);

};
