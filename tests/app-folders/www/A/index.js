module.exports = function (io) {
    io.res.write('i1');
    io.next();
};
