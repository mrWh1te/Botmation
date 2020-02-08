"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description   See unit tests for edge-case examples
 * @param folderNames list of folders to parse into a URL by adding a backslash to the end of each directory
 * @example    createURL('assets', 'screenshots') => 'assets/screenshots/'
 */
exports.createFolderURL = (...folderNames) => folderNames.reduce((folderUrl, folderName) => folderUrl + '/' + folderName, '.');
/**
 * @description   See unit tests for edge-case examples
 * @param fileDirectory
 * @param param1
 * @param fileName
 */
exports.getFileUrl = (fileDirectory, botOptions, fileName = '') => {
    var _a;
    const fileNameWithPrefix = fileName === '' ? '' : '/' + fileName; // prefix with folder (optional)
    if ((_a = botOptions) === null || _a === void 0 ? void 0 : _a.parent_output_directory) {
        if (fileDirectory) {
            return exports.createFolderURL(botOptions.parent_output_directory, fileDirectory) + fileNameWithPrefix;
        }
        return exports.createFolderURL(botOptions.parent_output_directory) + fileNameWithPrefix;
    }
    if (fileDirectory) {
        return exports.createFolderURL(fileDirectory) + fileNameWithPrefix;
    }
    return './' + fileNameWithPrefix;
};
