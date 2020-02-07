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
  const fileNameWithPrefix = fileName === '' ? '' : '/' + fileName // prefix with folder (optional)

  if (parent_output_directory) {
    if (fileDirectory) {
      return createFolderURL(parent_output_directory, fileDirectory) + fileNameWithPrefix
    }

    return createFolderURL(parent_output_directory) + fileNameWithPrefix
  }

  if (fileDirectory) {
    return createFolderURL(fileDirectory) + fileNameWithPrefix
  }
  
  return fileNameWithPrefix
}