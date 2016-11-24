'use strict';

module.exports = isRootCtrl;

const RC_NAME = require('../../constants').ROOT_CTRL_NAME;

function isRootCtrl (ctrl) {
    const hasParent = Boolean(ctrl.parent);
    const isRCName  = ctrl.name === RC_NAME;

    return !hasParent && isRCName;
}
