'use strict';

const {forIn} = require('../utils');

const {
	PARENT_CHAIN_INDEX,
	TARGET_CHAIN_INDEX,
	METHOD_CHAIN_INDEX,
} = require('../constants');

module.exports = {
    initSubCtrls,
	createProfile,
	removeCachedModule,
    removeSelfName,
	getNextInChain
};


function initSubCtrls (ctrl) {
	const subCtrls = ctrl.subCtrls;

	forIn(subCtrls, (name, subCtrlMap) => {
		// this ctrl is passed as a parent
		subCtrls[name] = new ctrl.constructor(name, subCtrlMap, ctrl);
	});
}


function removeCachedModule (path) {
	const mod = require.cache[path];

	if (mod) {
		mod.children.forEach((child) => {
			removeCachedModule(child.id);
		});

		delete require.cache[path];
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
	const first = getLoweredFirstParam(io);

	if (first && first === ctrl.name) {
		removeFirstParam(io);
	}
}


function createProfile (ctrl, io) {
	io._profiles[ctrl.id] = {
        idx        : 0,
        chainIndex : getChainIndex(ctrl, io)
    };
}


/*
    ┌────────────────────────────────────────────────────────────────────────────
    | test on checkIn, if this ctrl is the target ctrl for the current request.
    | checks if the next param is an existing sub
    |
    | returns
    | 	0 (parent)
    | 	1 (target)
    | 	2 (method)
*/
function getChainIndex (ctrl, io){
    let next = getLoweredFirstParam(io);

    if (next) {
        next = next.toLowerCase();

        if (ctrl.methods[next]) {
            return METHOD_CHAIN_INDEX;
        }
        else if (ctrl.subCtrls[next]) {
            return PARENT_CHAIN_INDEX;
        }

        return TARGET_CHAIN_INDEX;
    }

    return TARGET_CHAIN_INDEX;
}


/*
  ┌──────────────────────────────────────────────────────────────────────────
  │ ctrls has 3 chains of methods and uses only one of them per request.
  │
  │ io holds ctrl profiles with the index which represents the progress in 
  │ each chain.
  │
  │ by calling io.next() you increment that index.
 */
function getNextInChain (ctrl, io, incrementIndex = true) {
	// get ctrl profile
	const profile = io._profiles[ctrl.id];

	// increment chain index (when debugging - don't)
	const i = incrementIndex ? profile.idx++ : profile.idx;

	// is target? 0: sub, 1: target, 2: method
	const chainIndex = (profile.chainIndex);

	// get corresponding chain
	const chain = ctrl.chains[chainIndex];

	const nextInChain = chain[i];

	return nextInChain; 
}


