module.exports = function (io) {
    io.res.write('a');
    io.next();
};
