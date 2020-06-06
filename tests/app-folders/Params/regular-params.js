module.exports = function (io, seasonWord, seasonNumber, episodeWord, episodeNumber) {
	const params = [
		seasonWord, seasonNumber,
		episodeWord, episodeNumber,
	].join(',');

	io.res.write(params);
	io.next();
};
