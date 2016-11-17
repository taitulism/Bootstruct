module.exports = function (io) {
    io.res.write('f2');
    io.next();
};
