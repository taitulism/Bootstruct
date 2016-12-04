'use strict';

const log = require('./utils/log');

module.exports = {
    ignoreItemIsNotAString,
    cannotIgnoreReservedEntryName,
    expectingAnIndexFile,
    cannotFindWebRootFolder,
    fileAndFolderNameCollision,
    methodsWithNoParams,
    expectedAFunction,
    expectedAnObject,
    expectedAnArrayOfStrings,
    expectedFunctionArgument,
    ioInitExpectedAFunction,
    ioExitExpectedAFunction,
    sharedCtrlExpectedAFolder,
    objectKeyAlreadyExists,
    hookFunctionExpected,
};

const BTS_ERR = 'Bootstruct Error:';

// notString.toString() max chars
const MAX_CHARS = 50;

function ignoreItemIsNotAString (item) {
    item = item.toString();

    if (item.length > MAX_CHARS) {
        const trimmed = item.substr(0, MAX_CHARS);
        
        item = `${trimmed}...`;
    }

    log(BTS_ERR, [
        '"ignore" hook handler should export a string or an array of strings.',
        `skipping: "${item}"`
    ]);

    return false;
}

function cannotIgnoreReservedEntryName (item) {
    log(BTS_ERR, [
        '"ignore" hook: Trying to ignore a reserved entry name.',
        `skipping: "${item}"`
    ]);

    return false;
}

function expectingAnIndexFile (path) {
    log(BTS_ERR, [
        'Expecting an "index.js" file in:',
        `${path}`
    ]);

    return null;
}

function cannotFindWebRootFolder (webRoot) {
    log(BTS_ERR, [
        'Bootstruct couldn\'t find the web-root folder: ',
        `${webRoot}`
    ]);

    return false;
}

function fileAndFolderNameCollision (name, ctrlPath) {
    log(BTS_ERR, `You have a controller and a method with the same name (${name}) in: ${ctrlPath}`);

    return false;
}

function methodsWithNoParams (path) {
    log(BTS_ERR, [
        'Methods must handle at least one param (io)',
        `${path}`
    ]);
}

function expectedAFunction (path, type) {
    log(BTS_ERR, [
        `${path}`,
        `This entry is expected to export a single function. Got: ${type}`
    ]);

    return null;
}

function expectedAnObject (path, type) {
    log(BTS_ERR, [
        `${path}`,
        `This entry is expected to export an object. Got: ${type}`
    ]);

    return null;
}

function expectedAnArrayOfStrings () {
    log(BTS_ERR, '"ignore" hook handler should export an array of strings.');

    return false;
}

function expectedFunctionArgument () {
    log(BTS_ERR, [
        '"io.init" function must handle an argument: "app".',
        'You should call "app.checkIn(this)" when the function is done.'
    ]);

    return false;
}

function ioInitExpectedAFunction () {
    log(BTS_ERR, '"io.init" expected to be a function.');

    return false;
}

function ioExitExpectedAFunction () {
    log(BTS_ERR, '"io.exit" expected to be a function.');
 
    return false;
}

function sharedCtrlExpectedAFolder (path) {
    log(BTS_ERR, [
        '"shared_ctrls" - Controllers must be folders:',
        `${path}`
    ]);

    // log(BTS_ERR);
    // log('   "shared_ctrls" - Controllers must be folders:');
    // log(`   ${path}`);
    
    return false;
}

function objectKeyAlreadyExists (objName, key) {
    log(BTS_ERR, [
	`   Name collision on "${objName}" object.`,
	`   A prop/method named: "${key}" is already exists.`,
	'   Use another name.'
    ]);

    return false;
}

function hookFunctionExpected (objName, key) {
    log(BTS_ERR, [
	`   Expecting "${key}" to be a function.`,
	`   For: "${objName}" object.`
    ]);

    return false;
}
