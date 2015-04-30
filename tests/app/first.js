module.exports = function (io) {
if (io.req.url === '/favicon.ico') {io.res.end(); return;}

    console.log(__filename.match(/app.*/)[0] + '>');
    io.res.write(__filename.match(/app.*/)[0] + '>');
    io.next();
};