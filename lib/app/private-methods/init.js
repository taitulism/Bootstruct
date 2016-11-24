'use strict';

const ctrlHooksProto  = require('../../ctrl/hooks');
const createCtrlClass = require('../../ctrl');
const appHooksProto   = require('../hooks');
const createIOClass   = require('../../io');

module.exports = {
    ignoreList,
	hooks,
    prototypes,
};

function ignoreList (app) {
	app.ignoreList      = [];
	app.ignoreStartWith = ['_', '.'];
}

function hooks (app) {
    app.hooks = {
        app: Object.create(appHooksProto),
        ctrl: Object.create(ctrlHooksProto)
    };
}

function prototypes (app, debug) {
	app.Ctrl = createCtrlClass(debug);
	app.IO   = createIOClass();
	
	app.ctrl_proto = app.Ctrl.prototype;
	app.io_proto   = app.IO.prototype;
}
