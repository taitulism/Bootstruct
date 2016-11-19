'use strict';

const getFileName = require('path').basename;

const removeExt      = require('./utils/remove-extension');
const privateMethods = require('./ctrl/private-methods');

const removeSelfName = privateMethods.removeSelfName;
const getNextInChain = privateMethods.getNextInChain;
const createProfile  = privateMethods.createProfile;

const SPACE            = ' ';
const SPACE_MULTIPLIER = 2;

module.exports = {
	checkIn,
	next,
	checkOut
};

function checkIn (io) {
	this.name && removeSelfName(this, io);

	if (!this.parent) {
		debugRequest(io);
	}

	debugCtrlName(this);

	createProfile(this, io);

	this.next(io);
}

function next (io) {
	io.ctrl = this;

	const nextInChain = getNextInChain(this, io);

	if (nextInChain) {
		debugNext(this, io, nextInChain);

		nextInChain.apply(this, io._params);
	}
	else {
		this.checkOut(io);
	}
}

function checkOut (io) {
	this.parent && debugCtrlName(this.parent);

	if (this.name) {
		this.parent.next(io);
	}
	else {
		io.exit(this.global);
	}
}

function debugRequest (io) {
	const req = io.req;

	console.log();
	console.log(`Request: ${req.method} ${req.url}`);
	console.log('========');
}

function debugCtrlName (ctrl) {
	const appName = ctrl.global.webRootFolderName;

	const indent = getCtrlIndentLevel(ctrl);
	const spaces = getSpacesByIndent(indent);

	ctrl._debugIndentSpaces = spaces;

	console.log(`${spaces}${appName}${ctrl.id}`);
}

function getCtrlIndentLevel (ctrl) {
	if (!ctrl.parent) {
		return 0;
	}

	const ctrlId  = ctrl.id;
	const idParts = ctrlId.split('/');

	return idParts.length - 1;
}

function getSpacesByIndent (indent) {
	const totalIndent = indent * SPACE_MULTIPLIER;

	let spaces = '';

	for (let index = 0; index < totalIndent; index += 1) {
		spaces += SPACE;
	}

	return spaces;
}

function debugNext (ctrl, io, nextInChain) {
	const app         = ctrl.global;
	const nextName    = nextInChain.name;
	const reqMethod   = io.req.method.toLowerCase();
	const nextVerb    = ctrl.verbs[reqMethod];

	if (nextInChain.path) {
		debugHandlerPath(app, ctrl, nextInChain.path);
	}
	else if (nextName) {
		if (nextName === 'verb' && nextVerb) {
			debugHandlerPath(app, ctrl, nextVerb.path);
		}
		else if (nextName === 'method') {
			const methodName = io.params[0];

			debugHandlerPath(app, ctrl, ctrl.methods[methodName].path);
		}
	}
}

function debugHandlerPath (app, ctrl, path) {
	const spaces = `${ctrl._debugIndentSpaces}${SPACE}${SPACE}`;

	const filename         = getFileName(path);
	const withoutExtension = removeExt(filename);

	console.log(`${spaces}${withoutExtension}`);
}
