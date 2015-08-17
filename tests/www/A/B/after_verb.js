module.exports = function (io) {
    io.res.write('a2');
    io.next();
};