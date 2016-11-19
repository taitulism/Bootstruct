'use strict';

const removeSelfName = require('./ctrl/private-methods').removeSelfName;
const removeExt = require('./utils/remove-extension');

module.exports = {
	checkIn,
	next,
	checkOut
};

function checkIn (io) {
	let ctrlName = this.name;

	this.name && removeSelfName(this, io);

	if (!ctrlName) { //RC
		ctrlName = 'RC';
		debugRequest(io);
	}

	debugCtrlName(this);

	// create profile
	io._profiles[this.id] = {
		idx        : 0,
		chainIndex : this.getChainIndex(io)
	};

	this.next(io);
}

function next (io) {
	io.ctrl = this;

	const profile = io._profiles[this.id];
	const i = profile.idx++;
	const chainIndex = profile.chainIndex;
	const chain = this.chains[chainIndex]; 

	if (chain[i]) {
		debugNext(this, io, chain, i);

		chain[i].apply(this, io._params);
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
}


function debugCtrlName (ctrl) {
	const indent  = getCtrlIndent(ctrl);
	const spaces  = getSpacesByIndent(indent);

	const appName = ctrl.global.webRootFolderName; 

	ctrl._debugIndentSpaces = spaces;

	console.log(`${spaces}ctrl: ${appName}${ctrl.id}`);
}

function getCtrlIndent (ctrl) {
	if (!ctrl.parent) {
		return 0;
	}

	const ctrlId = ctrl.id;

	return ctrlId.split('/').length - 1;
}

function getSpacesByIndent (indent) {
	const indentMultiplyer = 4;
	const totalSpaces = indent * indentMultiplyer;

	let spaces = '';

	for (let index = 0; index < totalSpaces; index += 1) {
		spaces += ' ';
	}

	return spaces;
}

function debugNext (ctrl, io, chain, i) {
	const app         = ctrl.global;
	const nextInChain = chain[i];
	const nextName    = nextInChain.name;
	const reqMethod   = io.req.method.toLowerCase();
	const nextVerb    = ctrl.verbs[reqMethod];

	if (chain[i].path) {
		debugHandlerPath(app, ctrl, chain[i].path);
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
	const fourSpaces = '   ';
	const shortPath = getPathFromWebRoot(app, path);
	const spaces = `${ctrl._debugIndentSpaces}${fourSpaces}`;

	console.log(spaces, shortPath);
}

function getPathFromWebRoot (app, path) {
	const webrootName = app.webRootFolderName;
	const webrootPath = app.webRootFolderPath;

	const webrootLenDiff   = getWebrootLenDiff(webrootName, webrootPath);
	const shortPath        = path.substr(webrootLenDiff);
	const withoutExtension = removeExt(shortPath);

	return withoutExtension;
}


 /*
 | returns the difference between your webroot name length 
 | (e.g. "www" = 3) and the resolved webroot path length (e.g. "c:/path/to/www" = 14)
 | for debugNext fn to show methods' paths from "www" (e.g. to remove "c:/path/to/" = 11)
 |
 | 14 - 3 = return 11
*/
function getWebrootLenDiff (name, path) {
	const nameLen = name.length;
	const pathLen = path.length;

	const diff = pathLen - nameLen;

	return diff;
}
