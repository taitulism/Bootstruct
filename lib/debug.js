'use strict';

const $path = require('path');

const log            = require('./utils/log');
const removeExt      = require('./utils/remove-extension');
const getNextInChain = require('./ctrl/private-methods').getNextInChain;

const getFileName = $path.basename;
const resolvePath = $path.resolve;

const SPACE            = ' ';
const SPACE_MULTIPLIER = 2;

module.exports = {
	checkInWrapper,
	nextWrapper,
	checkOutWrapper
};

function checkInWrapper (checkIn) {
	return function (io) {
		if (!this.parent) {
			debugRequest(io);
		}

		debugCtrlName(this);

		checkIn.call(this, io);
	};
}

const DO_NOT_INCREMENT_INDEX = false;

function nextWrapper (next) {
	return function (io) {
		const nextInChain = getNextInChain(this, io, DO_NOT_INCREMENT_INDEX);

		if (nextInChain) {
			debugNext(this, io, nextInChain);
		}

		next.call(this, io);
	};
}

function checkOutWrapper (checkOut) {
	return function (io) {
		this.parent && debugCtrlName(this.parent);

		checkOut.call(this, io);
	};
}

function debugRequest (io) {
	const req = io.req;

	log();
	log(`Request: ${req.method} ${req.url}`);
	log('========');
}

function debugCtrlName (ctrl) {
	const appName = ctrl.app.webRootFolderName;

	const indent = getCtrlIndentLevel(ctrl);
	const spaces = getSpacesByIndent(indent);

	ctrl._debugIndentSpaces = spaces;

	const isShared = ctrl.isSharedCtrl ? '(shared ctrl)' : '';

	log(`${spaces}${appName}${ctrl.id} ${isShared}`);
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
	const app         = ctrl.app;
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

			let methodPath = ctrl.methods[methodName].path;

			if (!methodPath) {
				methodPath = getSharedMethodPath(methodName, app);
			}

			debugHandlerPath(app, ctrl, methodPath);
		}
	}
}

function debugHandlerPath (app, ctrl, path) {
	const spaces = `${ctrl._debugIndentSpaces}${SPACE}${SPACE}`;

	const filename         = getFileName(path);
	const withoutExtension = removeExt(filename);

	log(`${spaces}${withoutExtension}`);
}

function getSharedMethodPath (methodName, app) {
	const sharedMethodPath = resolvePath(app.hooksFolderPath, 'shared_methods', methodName);

	return sharedMethodPath;
}
