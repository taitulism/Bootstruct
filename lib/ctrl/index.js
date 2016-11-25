'use strict';

const debugFNs       = require('../debug');
const ROOT_CTRL_NAME = require('../constants').ROOT_CTRL_NAME;

const {
    setID,
    parseFolderMap,
    delegateNoVerb,
    setupChains,
    initSubCtrls,
    removeSelfName,
	createProfile,
	getNextInChain,
} = require('./private-methods');

module.exports = function (debug) {
	function Ctrl (name, folderMap, parent, global = parent.global) {
		this.isRootCtrl = name === ROOT_CTRL_NAME;

		this.name      = name;
		this.folderMap = folderMap;
		this.parent    = parent;
		this.global    = global;
		this.id        = setID(this);

		this.verbs    = Object.create(null);
		this.methods  = Object.create(this.global.shared_methods || null);
		this.subCtrls = Object.create(this.global.shared_ctrls   || null);

		// TODO: register ctrls?
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

			parseFolderMap(this);
			delegateNoVerb(this);
			setupChains(this);
			initSubCtrls(this);
		},


        /*
         ┌──────────────────────────────────────────────────
         | remove self name from io.params
         | profile io
         | run first in chain
        */
		checkIn (io) {
			!this.isRootCtrl && removeSelfName(this, io);

			createProfile(this, io);

			this.next(io);
		},

		next (io) {
			// set current handling ctrl
			io.ctrl = this;

			const nextInChain = getNextInChain(this, io);

			if (nextInChain) {
				nextInChain.call(this, io, ...io.params);
			}
			else {
				this.checkOut(io);
			}
		},

		checkOut (io) {
			if (this.isRootCtrl) {
				io.exit(this.global);
			}
			else {
				this.parent.next(io);
			}
		}
	};

	const ctrlProto = Ctrl.prototype;

	if (debug) {
		ctrlProto.checkIn  = debugFNs.checkInWrapper(ctrlProto.checkIn);
		ctrlProto.next     = debugFNs.nextWrapper(ctrlProto.next);
		ctrlProto.checkOut = debugFNs.checkOutWrapper(ctrlProto.checkOut);
	}

	return Ctrl;
};
