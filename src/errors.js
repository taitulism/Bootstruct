const log = require('./utils/log');

module.exports = {
	webRootFolderNotFound,
	ignoreItemIsNotAString,
	cannotIgnoreReservedEntryName,
	expectingAnIndexFile,
	fileAndFolderNameCollision,
	methodsWithNoParams,
	expectedFunctionArgument,
	ioInitExpectedAFunction,
	ioExitExpectedAFunction,
	sharedCtrlExpectedAFolder,
	objectKeyAlreadyExists,
	hookFunctionExpected,
};

const BTS = 'Bootstruct';
const ERROR = 'Error';
const BTS_ERR = `${BTS} ${ERROR}:`;

// notString.toString() max chars
const MAX_CHARS = 50;

// const RAWESC = '\x1b';
const UTF8ESC = '\u001b';
const ESC = UTF8ESC;
const FgRed = `${ESC}[31m`;
const FgGreen = `${ESC}[32m`;
const Reset = `${ESC}[0m`;

function createLogMessage (type, lines) {
	const TITLE = `\n ${FgRed}${BTS} ${type}:${Reset}	`;

	if (typeof lines === 'string') {
		return `${TITLE}\n${lines}\n`;
	}
	const joined = lines.join('\n	');

	return `${TITLE}\n	${FgGreen}${joined}${Reset}\n`;
}

function webRootFolderNotFound (path) {
	const logText = createLogMessage(ERROR, [
		'Bootstruct couldn\'t find the web-root folder:',
		`${path}`,
	]);

	return new Error(logText);
}

function ignoreItemIsNotAString (item) {
	item = item.toString();

	if (item.length > MAX_CHARS) {
		const trimmed = item.substr(0, MAX_CHARS);

		item = `${trimmed}...`;
	}

	const logText = createLogMessage(ERROR, [
		'"ignore" hook handler should export a string or an array of strings.',
		`Got: "${item}"`,
	]);

	return new Error(logText);
}

function expectingAnIndexFile (path) {
	const logText = createLogMessage(ERROR, [
		'Expecting an "index.js" file in:',
		`${path}`,
	]);

	return new Error(logText);
}

function fileAndFolderNameCollision (duplicatedNames, ctrlPath) {
	const logText = createLogMessage(ERROR, [
		'You have a controller and a method with the same name:',
		`(${duplicatedNames.join(', ')}) in: ${ctrlPath}`,
	]);

	return new Error(logText);
}

function methodsWithNoParams (path) {
	const logText = createLogMessage(ERROR, [
		'Methods must handle at least one param (io)',
		`${path}`,
	]);

	return new Error(logText);
}

function expectedFunctionArgument () {
	const logText = createLogMessage(ERROR, [
		'"io.init" function must handle an argument: "app".',
		'You should call "app.checkIn(this)" when the function is done.',
	]);

	return new Error(logText);
}

function ioInitExpectedAFunction (err) {
	const logText = createLogMessage(ERROR, [
		'"io_init" expected to be a function.',
		err.message,
	]);

	return new Error(logText);
}

function ioExitExpectedAFunction (err) {
	const logText = createLogMessage(ERROR, [
		'"io_exit" expected to be a function.',
		err.message,
	]);

	return new Error(logText);
}

function sharedCtrlExpectedAFolder (path) {
	const logText = createLogMessage(ERROR, [
		'"shared_ctrls" - Controllers must be folders:',
		`${path}`,
	]);

	return new Error(logText);
}


function objectKeyAlreadyExists (objName, key) {
	log(BTS_ERR, [
		`   Name collision on "${objName}" object.`,
		`   A prop/method named: "${key}" is already exists.`,
		'   Use another name.',
	]);

	return false;
}

function hookFunctionExpected (objName, key) {
	log(BTS_ERR, [
		`   Expecting "${key}" to be a function.`,
		`   For: "${objName}" object.`,
	]);

	return false;
}

function cannotIgnoreReservedEntryName (item) {
	log(BTS_ERR, [
		'"ignore" hook: Trying to ignore a reserved entry name.',
		`skipping: "${item}"`,
	]);

	return false;
}
