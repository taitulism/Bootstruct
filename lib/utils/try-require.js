'use strict';

const isArray = require('./is-array');
const log = require('./log');

const BTS_ERR = 'Bootstruct Error:';

module.exports = {
	tryRequireFn,
	tryRequireObj,
	getFn,
	getObj,
};


function getFn (path) {
	const {content, err} = tryRequire(path);
	const type = typeof content;

	if (!content) {
		return {
			err,
			content: null,
		};
	}

	if (type !== 'function') {
		return {
			err: new Error(`This entry is expected to export a single function. Got: ${type}`),
			content: null,
		};
	}

	return {
		content,
		err: null
	};
}

function isObj (thing) {
	return typeof thing === 'object' && thing !== null && !isArray(thing);
}

function getObj (path) {
	const {content, err} = tryRequire(path);
	const type = typeof content;

	if (!content) {
		log(BTS_ERR, [
			`${path}`,
			`Failed to require ${path}`
		]);
		log(err.message);
	
		return false;
	}
	
	if (!isObj(content)) {
		log(BTS_ERR, [
			`${path}`,
			`This entry is expected to export an object. Got: ${type}`
		]);
		return false;
	}
	
	return content;
}


function tryRequire (path) {
	if (typeof path !== 'string') {
		const type = typeof path;

		return {
			content: null,
			err: new Error(`tryRequire(path): 'path' should be a string. Got: ${type}`)
		};
	}

	try {
		return {
			content: require(path),
			err: null
		};
	}
	catch (exception) {
		return {
			content: null,
			err: exception
		};
	}
}

/*
 ┌──────────────────────────────────────────────────
 │ validate a require(path) returns a function
 │ returns: module | null (valid|invalid)
*/
function tryRequireFn (path) {
	const req  = require(path);
	const type = typeof req;

	if (type === 'function') {
		return req;
	}

	return expectedAFunction(path, type);
}

/*
 ┌──────────────────────────────────────────
 │ validate a require(path) returns an object
 │ returns: module | null (valid|invalid)
*/
function tryRequireObj (path) {
	const req  = require(path);
	const type = typeof req;

	// typeof null == 'object'. it would count as invalid
	if (type === 'object' && !isArray(req)) {
		return req;
	}

	return expectedAnObject(path, type);
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
