"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param folderNames list of folders to parse into a URL by adding a backslash to the end of each directory
 * @example    createURL('assets', 'screenshots') => 'assets/screenshots/'
 */
exports.createURL = (...folderNames) => folderNames.reduce((folderUrl, folderName) => folderUrl + folderName + '/', '');
