module.exports = function (io) {
    io.res.write('asd');

    if (io.params[0] === 'bla' && io.params[1] === 'blu') {
        io.res.write('blablu');
    }

    io.next();
};
