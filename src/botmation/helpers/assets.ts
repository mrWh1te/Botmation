import { BotOptions } from "botmation/interfaces/bot-options.interfaces"

/**
 * @description   See unit tests for edge-case examples
 * @param folderNames list of folders to parse into a URL by prepending a backslash to each directory
 *                Given the prepending strategy, you can use this to create a full URL to a file, if you could the file name as a folder name
 * @example    createURL('assets', 'screenshots') => './assets/screenshots'
 *             createUrl('assets', 'screenshots', 'example.png') => './assets/screenshots/example.png'
 */
export const createFolderURL = (...folderNames: string[]): string => 
  folderNames.reduce((folderUrl, folderName) => folderUrl + '/' + folderName, '.')

/**
 * @description   See unit tests for edge-case examples
 *                When it comes to storing newly created assets, we depend on the values of BotOptions in knowing where to store the assets
 * @param fileDirectory what are we creating? screenshots, cookies, etc
 * @param botOptions pass this in so we can create the URL
 * @param fileName 
 */
export const getFileUrl = (fileDirectory: string, botOptions: BotOptions, fileName: string = ''): string => {
  const fileNameWithPrefix = fileName === '' ? '' : '/' + fileName // prefix with folder (optional)

  if (botOptions?.parent_output_directory) {
    if (fileDirectory) {
      return createFolderURL(botOptions.parent_output_directory, fileDirectory) + fileNameWithPrefix
    }

    return createFolderURL(botOptions.parent_output_directory) + fileNameWithPrefix
  }

  if (fileDirectory) {
    return createFolderURL(fileDirectory) + fileNameWithPrefix
  }
  
  return './' + fileNameWithPrefix
}