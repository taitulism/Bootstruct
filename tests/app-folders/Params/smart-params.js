module.exports = function (io, $season, $episode) {
	io.res.write(`season:${$season},episode:${$episode}`);
	io.next();
};
