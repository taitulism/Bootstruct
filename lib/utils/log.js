'use strict';

const {isString, isArray} = require('./');

module.exports = log;

// eslint-disable-next-line no-console
const clog = console.log;

function log (title, content) {
    if (!title) {
        // log empty line
        clog();
        return;
    }

    const titleIsString = isString(title);

    if (titleIsString && !content) {
        // log a simple line
        clog(title); 
        // maybe instead, use "log()" for recuresion arrays
        return;
    }

    if (isString(content)) {
        // log a title and an indented line
        clog(title);
        clog(`    ${content}`);
        return;
    }

    if (titleIsString && isArray(content)) {
        clog(title);
        content.forEach((line) => {
            if (isString(line)) {
                clog(`    ${line}`);
            }
        });
    }
}
