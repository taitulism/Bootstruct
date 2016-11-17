'use strict';

const {forIn, f2j} = require('../utils');
const debugFNs = require('../debug');

const {
	FOLDER,
	PARENT_CHAIN_INDEX,
	TARGET_CHAIN_INDEX,
	METHOD_CHAIN_INDEX,
} = require('../constants');

const {
    setID,
    parseFolderMap,
    delegateNoVerb,
    setupChains,
    initSubCtrls,
    removeCachedModule,
    getLoweredFirstParam,
    removeSelfName

} = require('./private-methods');

module.exports = function (debug) {
	function Ctrl (name, folderMap, parent, global) {
		this.name      = name;
		this.folderMap = folderMap;
		this.parent    = parent;
		this.global    = global || parent.global;
		this.id        = setID(this);

		this.verbs    = Object.create(null);
		this.methods  = Object.create(this.global.shared_methods || null);
		this.subCtrls = Object.create(this.global.shared_ctrls   || null);

		// TODO: register
		// this.global.ctrls[this.id] = this;

		this.init();
	}


	Ctrl.prototype = {
		constructor: Ctrl,

		name      : null,
		folderMap : null,
		parent    : null,
		global    : null,
		id        : null,
		verbs     : null,
		noVerb    : null,
		methods   : null,
		subCtrls  : null,
		chains    : null,

		init (reMap) {
			if (reMap) {
				this.reMap();
			}

			// parse
			parseFolderMap(this);

			// init
			delegateNoVerb(this);
			setupChains(this);
			initSubCtrls(this);
		},

		reMap () {
			// remove the cached required modules from Node's cache
			forIn(this.folderMap.entries, (name, map) => {
				const lowered = name.toLowerCase();

				if (lowered === 'verbs' || lowered === 'verbs.js') {

					if (map.type === FOLDER) {
						forIn(map.entries, (name2, map2) => {
							removeCachedModule(map2.path);
						});
					}

					this.verbs = Object.create(null);
				}

				removeCachedModule(map.path);
			});

			this.folderMap = f2j(this.folderMap.path);
		},

        /*
         ┌──────────────────────────────────────────────────
         | remove self name from io.params
         | profile io
         | run first in chain
        */
		checkIn (io) {
			(this.name) && removeSelfName(this, io);

			// create profile
			io._profiles[this.id] = {
				idx        : 0,
				chainIndex : this.getChainIndex(io)
			};

			this.next(io);
		},

		/*
		 ┌────────────────────────────────────────────────────────────────────────────
		 | test on checkIn, if this ctrl is the target ctrl for the current request.
		 | checks if the next param is an existing sub
		 |
		 | returns
		 | 	0: parent
		 | 	1: target
		 | 	2: method
		*/
		getChainIndex (io) {
			let next = getLoweredFirstParam(io);

			if (next) {
				next = next.toLowerCase();

				if (this.methods[next]) {
					return METHOD_CHAIN_INDEX;
				}
				else if (this.subCtrls[next]) {
					return PARENT_CHAIN_INDEX;
				}

				return TARGET_CHAIN_INDEX;
			}

			return TARGET_CHAIN_INDEX;
		},

		next (io) {
			// set current handling ctrl
			io.ctrl = this;

			// get ctrl profile
			const profile = io._profiles[this.id];

			const i = profile.idx++;

			// is target? 0: sub, 1: target, 2: method
			const chainIndex = (profile.chainIndex);

			// get corresponding chain
			const chain = this.chains[chainIndex]; 

			// if there's more in the chain to run - run it. else - checkOut
			if (chain[i]) {
				chain[i].apply(this, io._params);
			}
			else {
				this.checkOut(io);
			}
		},

		checkOut (io) {
			if (this.name) {
				this.parent.next(io);
			}
			else {
				io.exit(this.global);
			}
		}
	};

	if (debug) {
		Ctrl.prototype.checkIn = debugFNs.checkIn;
		Ctrl.prototype.next    = debugFNs.next;
	}

	return Ctrl;
};
