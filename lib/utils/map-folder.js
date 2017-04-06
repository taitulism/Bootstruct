
const fs    = require('fs');
const $path = require('path');

const {FOLDER, FILE} = require('../constants');

const joinPath    = $path.join;
const resolvePath = $path.resolve;

const fsStat    = fs.stat;
const fsReadDir = fs.readdir;

function mapFolder (folderPath, endCallBack) {
    const folderMapObj = Object.create(null);

    folderMapObj.type    = FOLDER
    folderMapObj.path    = resolvePath(folderPath);
    folderMapObj.entries = Object.create(null);

    fsReadDir(folderPath, (entryErr, entries) => {
        if (entryErr) {
            return endCallBack(entryErr);
        }
        
        const entriesLen = entries.length;

        if (entriesLen === 0) {
            return endCallBack(null, folderMapObj);
        }

        const done = createDone(entriesLen, endCallBack);

        entries.forEach((entryName) => {
            const entryPath = joinPath(folderMapObj.path, entryName);

            const entryMap = Object.create(null);

            entryMap.path = entryPath;

            fsStat(entryPath, (statErr, stat) => {
                if (statErr) {
                    return done(statErr);
                }

                entryMap.type = getEntryType(stat);

                if (entryMap.type === FILE) {
                    folderMapObj.entries[entryName] = entryMap;

                    return done(null, folderMapObj);
                }
                else { // FOLDER
                    mapFolder(entryPath, (mapFolderErr, result) => {
                        if (mapFolderErr) {
                            return done(mapFolderErr);
                        }

                        folderMapObj.entries[entryName] = result;

                        return done(null, folderMapObj);
                    });
                }                
            });
        });
    });
}

module.exports = mapFolder;

function createDone (maxCount, endCallBack) {
    let doneCount = 0;
    
    return function (err, folderMapObj) {
        if (err) {
            return endCallBack(err, null);
        }

        doneCount++;

        if (doneCount === maxCount) {
            return endCallBack(null, folderMapObj);
        }
    };
}

function getEntryType (stat) {
    const isFolder = stat.isDirectory();

    if (isFolder) {
        return FOLDER;
    }
    
    // TODO: SYMLINK - only with fs.lstat (currently using fs.stat)
    /*
        const isFile = entryStat.isFile();

        if (isFile) {
            return FILE;
        }

        return SYMLINK;
    */

    return FILE;
}