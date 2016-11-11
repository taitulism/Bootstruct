'use strict';


const chains = ['Parent', 'Target', 'Method'];

 /*
 | returns the difference between your webroot name length 
 | (e.g. "www" = 3) and the resolved webroot path length (e.g. "c:/path/to/www" = 14)
 | for debugNext fn to show methods' paths from "www" (e.g. to remove "c:/path/to/" = 11)
 |
 | 14 - 3 = return 11
*/
function getWebrootLenDiff (app) {
	const webrootLen  = app._webRoot.length;
	const resolvedLen = app.webRoot.length;
	const diff        = resolvedLen - webrootLen;

	return diff;
}


function debugNext (ctrl, io, chain, i) {
	const nextInChain    = chain[i];
	const nextName       = nextInChain.name;
	const verb           = io.req.method.toLowerCase();
	const webrootLenDiff = getWebrootLenDiff(ctrl.global);

	if (chain[i].path) {
		const webrootPath  = chain[i].path.substr(webrootLenDiff);

		console.log('   ', webrootPath);
	}
	else if (nextName && nextName === 'verb' && ctrl.verbs[verb].path) {
		console.log('   ', ctrl.verbs[verb].path.substr(webrootLenDiff));
	}
}


function getLoweredFirstParam (io) {
	const firstParam = io.params[0];

	if (!firstParam) return null;

	return firstParam.toLowerCase();
}

function removeSelfName (ctrl, io) {
	const first = getLoweredFirstParam(io);

	if (first && first === ctrl.name) {
		io.removeFirstParam();
	}
}


module.exports.checkIn = function (io) {
	let ctrlName = this.name;

	(this.name) && removeSelfName(this, io);

	if (!ctrlName) { //RC
		ctrlName = 'RC';
		console.log(`debug request: ${io.req.method} ${io.req.url}`);
	}

	console.log(`ctrlName - ${chains[this.getChainIndex(io)]}`);

	// create profile
	io._profiles[this.id] = {
		idx        : 0,
		chainIndex : this.getChainIndex(io)
	};

	this.next(io);
};


module.exports.next = function (io) {
	io.ctrl = this;

	const profile = io._profiles[this.id];
	const i = profile.idx++;
	const chainIndex = (profile.chainIndex);
	const chain = this.chains[chainIndex]; 

	if (chain[i]) {
		debugNext(this, io, chain, i);

		chain[i].apply(this, io._params);
	}
	else {
		this.parent && console.log(this.parent.name || 'RC');

		this.checkOut(io);
	}
};
