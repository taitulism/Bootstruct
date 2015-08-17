module.exports = function (io) {
    io.res.write('prs1');
    io.next();
};