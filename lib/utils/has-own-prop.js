'use strict';

const hasOwnProp = Object.prototype.hasOwnProperty; 

module.exports = function (obj, prop) {
    return hasOwnProp.call(obj, prop);
};
