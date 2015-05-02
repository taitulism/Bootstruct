module.exports = function (io) {
    io.res.write(__filename.match(/app.*/)[0] + '>');
    io.next();
};
