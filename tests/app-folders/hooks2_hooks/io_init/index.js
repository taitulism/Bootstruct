module.exports = function (app) {
	this.initiated = 'io-initiated';

	setTimeout(() => {
		app.checkIn(this);
	}, 0);
};
