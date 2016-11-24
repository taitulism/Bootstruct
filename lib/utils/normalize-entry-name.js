'use strict';

const removeExt = require('./remove-extension');

/*
 ┌────────────────────────────────────────────────
 │ returns lowerCased extension-less entryname.
*/
module.exports = function (entryName, isFile) {
    const name = entryName.toLowerCase();

    if (typeof isFile === 'undefined') {
        isFile = true;
    }

    return (isFile) ? removeExt(name) : name;
};
