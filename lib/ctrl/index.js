'use strict';

const debugFNs       = require('../debug');

const setID          = require('./private-methods/set-id');
const parseFolderMap = require('./private-methods/parse-folder-map');
const delegateNoVerb = require('./private-methods/delegate-no-verb');
const setupChains    = require('./private-methods/setup-chains');
const initSubCtrls   = require('./private-methods/init-sub-ctrls');
const removeSelfName = require('./private-methods/remove-self-name');
const createProfile  = require('./private-methods/create-profile');
const getNextInChain = require('./private-methods/get-next-in-chain');

const ROOT_CTRL_NAME = require('../constants').ROOT_CTRL_NAME;

module.exports = function (debug) {
	function Ctrl (name, folderMap, parent, app) {
		app = app || parent.app;

		this.isRootCtrl = name === ROOT_CTRL_NAME;

		this.name      = name;
		this.folderMap = folderMap;
		this.parent    = parent;
		this.app       = app;
		this.id        = setID(this);

		this.verbs    = Object.create(null);
		this.methods  = Object.create(app.shared_methods || null);
		this.subCtrls = Object.create(app.shared_ctrls   || null);

		// TODO: register ctrls?
		// this.app.ctrls[this.id] = this;

		this.init();
	}


	Ctrl.prototype = {
		constructor: Ctrl,

		name      : null,
		folderMap : null,
		parent    : null,
		app       : null,
		id        : null,
		verbs     : null,
		noVerb    : null,
		methods   : null,
		subCtrls  : null,
		chains    : null,

		init () {
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
				io.exit(this.app);
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
