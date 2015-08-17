module.exports = function (io) {
    io.res.write('zxc');
    io.next();
};