module.exports = function (io) {
    io.res.write('prs');
    io.next();
};