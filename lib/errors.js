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

    log(BTS_ERR);
    log('   "ignore" hook handler should export a string or an array of strings.');
    log(`   skipping: "${item}"`);

    return false;
}

function cannotIgnoreReservedEntryName (item) {
    log(BTS_ERR);
    log('   "ignore" hook: Trying to ignore a reserved entry name.');
    log(`   skipping: "${item}"`);
    
    return false;
}

function expectingAnIndexFile (path) {
    log(BTS_ERR);
    log('    Expecting an "index.js" file in:');
    log(`    ${path}`);
    
    return null;
}

function cannotFindWebRootFolder (webRoot) {
    log(BTS_ERR);
    log('    Bootstruct couldn\'t find the web-root folder: ');
	log(`    ${webRoot}`);

    return false;
}

function fileAndFolderNameCollision (name, ctrlPath) {
    log(BTS_ERR);
    log(`   You have a controller and a method with the same name (${name}) in: ${ctrlPath}`);

    return false;
}

function methodsWithNoParams (path) {
    log(BTS_ERR);
    log('    Methods must handle at least one param (io)');
    log(`    ${path}`);
}

function expectedAFunction (path, type) {
    log(BTS_ERR);
    log(`    ${path}`);
    log(`    This entry is expected to export a single function. Got: ${type}`);

    return null;
}

function expectedAnObject (path, type) {
    log(BTS_ERR);
    log(`    ${path}`);
    log(`    This entry is expected to export an object. Got: ${type}`);

    return null;
}

function expectedAnArrayOfStrings () {
    log(BTS_ERR);
    log('   "ignore" hook handler should export an array of strings.');

    return false;
}

function expectedFunctionArgument () {
    log(BTS_ERR);
    log('   "io.init" function must handle an argument: "app".');
    log('   You should call "app.checkIn(this)" when the function is done.');
    
    return false;
}

function ioInitExpectedAFunction () {
    log(BTS_ERR);
    log('   "io.init" expected to be a function.');

    return false;
}

function ioExitExpectedAFunction () {
    log(BTS_ERR);
    log('   "io.exit" expected to be a function.');
 
    return false;
}

function sharedCtrlExpectedAFolder (path) {
    log(BTS_ERR);
    log('   "shared_ctrls" - Controllers must be folders:', path);
    
    return false;
}

function objectKeyAlreadyExists (objName, key) {
    log(BTS_ERR);
	log(`   Name collision on "${objName}" object.`);
	log(`   A prop/method named: "${key}" is already exists.`);
	log('   Use another name.');

    return false;
}

function hookFunctionExpected (objName, key) {
    log(BTS_ERR);
	log(`   Expecting "${key}" to be a function.`);
	log(`   For: "${objName}" object.`);
    
    return false;
}
