module.exports = function (io) {
    io.res.write('pts1');
    io.next();
};