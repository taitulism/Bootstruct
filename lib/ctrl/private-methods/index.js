'use strict';

module.exports = {
    setID             : require('./set-id'),
    parseFolderMap    : require('./parse-folder-map'),
    createProfile     : require('./create-profile'),
    getChainIndex     : require('./get-chain-index'),
    getNextInChain    : require('./get-next-in-chain'),
    has               : require('./has'),
    run               : require('./run'),
    initSubCtrls      : require('./init-sub-ctrls'),
    removeCachedModule: require('./remove-cached-module'),
    removeSelfName    : require('./remove-self-name'),
    setupChains       : require('./setup-chains'),
    delegateNoVerb    : require('./delegate-no-verb'),
};
