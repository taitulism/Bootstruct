module.exports = function (app) {
	this.initiated = 'io_init';
	app.checkIn(this);
};