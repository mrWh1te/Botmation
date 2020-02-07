"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
/**
 * @description   Simple method to return a Promise to check it a file exists or not
 *                No matter what, the promise WILL resolve and will resolve TRUE or FALSE
 * @param filePath
 * @return Promise<boolean>
 */
exports.fileExist = (filePath) => new Promise(resolve => {
    fs.access(filePath, fs.F_OK, (err) => {
        if (err) {
            // console.error(err)
            return resolve(false);
        }
        //file exists
        resolve(true);
    });
});
exports.deleteFile = (filePath) => new Promise((resolve, reject) => {
    fs.unlink(filePath, function (err) {
        if (err)
            return reject(err);
        // if no error, file has been deleted successfully
        return resolve();
    });
});
