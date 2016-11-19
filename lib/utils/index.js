'use strict';

const normalizeEntryName = require('./normalize-entry-name');
const shouldBeIgnored    = require('./should-be-ignored');
const removeExtension    = require('./remove-extension');
const tryRequire         = require('./try-require');
const isFunction         = require('./is-function');
const getProto           = require('./get-proto');
const isEmpty            = require('./is-empty');
const forIn              = require('./for-in');
const f2j                = require('./f2j');

module.exports = {
    f2j,
    forIn,
    isEmpty,
    getProto,
    isFunction,
    tryRequire,
    removeExtension,
    shouldBeIgnored,
    normalizeEntryName
};
