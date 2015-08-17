module.exports = function (io) {
    io.res.write('pts');
    io.next();
};