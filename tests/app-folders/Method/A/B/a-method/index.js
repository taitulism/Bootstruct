module.exports = function (io) {
    if (this.methods['a-method']){
        io.res.write('method');
    }

	io.next();
};
