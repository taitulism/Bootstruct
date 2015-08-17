module.exports = function (io) {
    io.res.write('f1');
    io.next();
};