module.exports = function (io) {
    io.res.write('ptm2');
    io.next();
};