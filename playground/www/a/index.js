module.exports = function (io) {
	io.res.end('/a');
    io.next()
}
