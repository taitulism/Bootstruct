
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

    console.log(BTS_ERR);
    console.log('   "ignore" hook handler should export a string or an array of strings.');
    console.log(`   skipping: "${item}"`);

    return false;
}

function cannotIgnoreReservedEntryName (item) {
    console.log(BTS_ERR);
    console.log('   "ignore" hook: Trying to ignore a reserved entry name.');
    console.log(`   skipping: "${item}"`);
    
    return false;
}

function expectingAnIndexFile (path) {
    console.log(BTS_ERR);
    console.log('    Expecting an "index.js" file in:');
    console.log(`    ${path}`);
    
    return null;
}

function cannotFindWebRootFolder (webRoot) {
    console.log(BTS_ERR);
    console.log('    Bootstruct couldn\'t find the web-root folder: ');
	console.log(`    ${webRoot}`);

    return false;
}

function fileAndFolderNameCollision (name, ctrlPath) {
    console.log(BTS_ERR);
    console.log(`   You have a controller and a method with the same name (${name}) in: ${ctrlPath}`);

    return false;
}

function methodsWithNoParams (path) {
    console.log(BTS_ERR);
    console.log('    Methods must handle at least one param (io)');
    console.log(`    ${path}`);
}

function expectedAFunction (path, type) {
    console.log(BTS_ERR);
    console.log(`    ${path}`);
    console.log(`    This entry is expected to export a single function. Got: ${type}`);

    return null;
}

function expectedAnObject (path, type) {
    console.log(BTS_ERR);
    console.log(`    ${path}`);
    console.log(`    This entry is expected to export an object. Got: ${type}`);

    return null;
}

function expectedAnArrayOfStrings () {
    console.log(BTS_ERR);
    console.log('   "ignore" hook handler should export an array of strings.');

    return false;
}

function expectedFunctionArgument () {
    console.log(BTS_ERR);
    console.log('   "io.init" function must handle an argument: "app".');
    console.log('   You should call "app.checkIn(this)" when the function is done.');
    
    return false;
}

function ioInitExpectedAFunction () {
    console.log(BTS_ERR);
    console.log('   "io.init" expected to be a function.');

    return false;
}

function ioExitExpectedAFunction () {
    console.log(BTS_ERR);
    console.log('   "io.exit" expected to be a function.');
 
    return false;
}

function sharedCtrlExpectedAFolder (path) {
    console.log(BTS_ERR);
    console.log('   "shared_ctrls" - Controllers must be folders:', path);
    
    return false;
}

function objectKeyAlreadyExists (objName, key) {
    console.log(BTS_ERR);
	console.log(`   Name collision on "${objName}" object.`);
	console.log(`   A prop/method named: "${key}" is already exists.`);
	console.log('   Use another name.');

    return false;
}

function hookFunctionExpected (objName, key) {
    console.log(BTS_ERR);
	console.log(`   Expecting "${key}" to be a function.`);
	console.log(`   For: "${objName}" object.`);
    
    return false;
}
