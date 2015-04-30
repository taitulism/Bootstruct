module.exports = function (io) {
    console.log(__filename);
    io.res.write(__filename.match(/app.*/)[0] + '>');
    io.next();
};
