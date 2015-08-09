module.exports = function (io) {
    io.res.write(__filename.match(/www.*/)[0] + '>');
    io.next();
};