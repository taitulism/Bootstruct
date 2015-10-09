module.exports = function (io) {
    io.res.write('prm2');
    io.next();
};
