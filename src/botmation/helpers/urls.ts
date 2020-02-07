import { BotOptions } from "@botmation/interfaces/bot-options.interfaces"

/**
 * @param folderNames list of folders to parse into a URL by adding a backslash to the end of each directory
 * @example    createURL('assets', 'screenshots') => 'assets/screenshots/'
 */
const createFolderURL = (...folderNames: string[]): string => 
  folderNames.reduce((folderUrl, folderName) => folderUrl + '/' + folderName, '.')

/**
 * 
 * @param fileDirectory 
 * @param param1 
 * @param fileName 
 */
export const getFileUrl = (fileDirectory: string, {parent_output_directory}: BotOptions, fileName: string = ''): string => {
  if (parent_output_directory) {
    return createFolderURL(parent_output_directory, fileDirectory) + fileName
  }

  return createFolderURL(fileDirectory) + fileName
}