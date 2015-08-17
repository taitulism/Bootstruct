module.exports = function (io) {
    io.res.write('l');
    io.next();
};