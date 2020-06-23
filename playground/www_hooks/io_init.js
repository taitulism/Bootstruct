module.exports = function (app) {
	this.initiated = 'io-initiated';
	app.checkIn(this);
};
