var chains = ['Parent', 'Target', 'Method'];

 /*
 | returns the difference between your webroot name length 
 | (e.g. "www" = 3) and the resolved webroot path length (e.g. "c:/path/to/www" = 14)
 | for debugNext fn to show methods' paths from "www" (e.g. to remove "c:/path/to/" = 11)
 |
 | 14 - 3 = return 11
*/
function getWebrootLenDiff (app) {
	var webrootLen  = app._webRoot.length;
	var resolvedLen = app.webRoot.length;
	var diff        = resolvedLen - webrootLen;

	return diff;
}



function debugNext (ctrl, io, chain, i) {
	var webrootPath;
	var nextInChain    = chain[i];
	var nextName       = nextInChain.name;
	var verb           = io.req.method.toLowerCase();
	var webrootLenDiff = getWebrootLenDiff(ctrl.global);
	var next_or_verb   = (nextName == 'verb') ? verb : io.params[0];

	if (chain[i].path) {
		webrootPath  = chain[i].path.substr(webrootLenDiff);
		console.log('   ', webrootPath);
	}
	else if (nextName && nextName == 'verb' && ctrl.verbs[verb].path) {
		console.log('   ', ctrl.verbs[verb].path.substr(webrootLenDiff));
	}
}



/*
  ┌──────────────────────────────────────
  │ example:
  │ 	url:  /A/B/C
  │		on "RC" check-in:
  │ 		io.params = ['A','B','C']
  │
  │		on "A" ctrl check-in:
  │ 		io.params = ['B','C']
 */
function removeSelfName (ctrl, io) {
	var first = io.params[0];

	if (first && first.toLowerCase() === ctrl.name) {
		// remove first
		io.params.shift();
	}
}



module.exports.checkIn = function checkIn (io) {
	var ctrlName = this.name;

	removeSelfName(this, io);

	if (!ctrlName) { //RC
		ctrlName = 'RC';
		console.log('debug request: ' + io.req.method + ' ' + io.req.url);
	}

	console.log(ctrlName + ' - ' + chains[this.getChainIndex(io)]);

	// create profile
	io._profiles[this.id] = {
		idx        : 0,
		chainIndex : this.getChainIndex(io)
	};

	this.next(io);
};


module.exports.next = function next (io) {
	var profile, i, chainIndex, chain;

	io._ctrl = this;

	profile = io._profiles[this.id];

	i = profile.idx++;

	chainIndex = (profile.chainIndex);

	chain = this.chains[chainIndex]; 

	if (chain[i]) {
    	debugNext(this, io, chain, i);

		chain[i].call(this, io);
	}
	else {
		this.parent && console.log(this.parent.name || 'RC');
		this.checkOut(io);
	}
};