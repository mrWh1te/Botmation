"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param folderNames list of folders to parse into a URL by adding a backslash to the end of each directory
 * @example    createURL('assets', 'screenshots') => 'assets/screenshots/'
 */
const createFolderURL = (...folderNames) => folderNames.reduce((folderUrl, folderName) => folderUrl + '/' + folderName, '.');
/**
 *
 * @param fileDirectory
 * @param param1
 * @param fileName
 */
exports.getFileUrl = (fileDirectory, { parent_output_directory }, fileName = '') => {
    if (parent_output_directory) {
        return createFolderURL(parent_output_directory, fileDirectory) + fileName;
    }
    return createFolderURL(fileDirectory) + fileName;
};
