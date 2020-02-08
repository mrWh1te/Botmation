import { BotOptions } from "@botmation/interfaces/bot-options.interfaces";
/**
 * @description   See unit tests for edge-case examples
 * @param folderNames list of folders to parse into a URL by adding a backslash to the end of each directory
 * @example    createURL('assets', 'screenshots') => 'assets/screenshots/'
 */
export declare const createFolderURL: (...folderNames: string[]) => string;
/**
 * @description   See unit tests for edge-case examples
 * @param fileDirectory
 * @param param1
 * @param fileName
 */
export declare const getFileUrl: (fileDirectory: string, botOptions: BotOptions, fileName?: string) => string;
