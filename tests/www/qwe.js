module.exports = function (io) {
    io.res.write('qwe');
    io.next();
};