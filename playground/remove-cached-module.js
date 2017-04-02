'use strict';

function removeCachedModule (path) {
	const mod = require.cache[path];

	if (mod) {
		mod.children.forEach((child) => {
			removeCachedModule(child.id);
		});

		delete require.cache[path];
	}
}

module.exports = removeCachedModule;


// Ctrl.prototype.remap
const reMap = () => {
    // remove the cached required modules from Node's cache
    forIn(this.folderMap.entries, (name, map) => {
        const lowered = name.toLowerCase();

        if (lowered === '$verbs' || lowered === '$verbs.js') {
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
};
