'use strict';

const {isString, isArray} = require('./');

module.exports = log;

function createLogger (NSP) {
    function log (title, message, ...args) {
        clog(`${NSP}:`);
        clog(`  ${title}`);

        if (condition) {
            
        }
        clog(`  ${message}`);
    }

    return log;
}

// eslint-disable-next-line no-console
const _log = console.log;
// eslint-disable-next-line no-console
const clog = console.log;

function log (title, content) {
    if (!title) {
        // log empty line
        _log();
        return;
    }

    const titleIsString = isString(title);

    if (titleIsString && !content) {
        // log a simple line
        _log(title); 
        // maybe instead, use "log()" for recuresion arrays
        return;
    }

    if (isString(content)) {
        // log a title and an indented line
        _log(title);
        _log(`    ${content}`);
        return;
    }

    if (titleIsString && isArray(content)) {
        _log(title);
        content.forEach((line) => {
            if (isString(line)) {
                _log(`    ${line}`);
            }
        });
    }
}
