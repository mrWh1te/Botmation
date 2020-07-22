import { BotFileOptions } from "botmation/interfaces/bot-file-options"

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
 *                When it comes to storing newly created assets, we depend on the values of BotFileOptions in knowing where to store the assets
 * @param fileDirectory what are we creating? screenshots, cookies, etc
 * @param botFileOptions pass this in so we can create the URL
 * @param fileName 
 */
export const getFileUrl = (fileDirectory: string, filesConfig: BotFileOptions, fileName: string = ''): string => {
  const fileNameWithPrefix = fileName === '' ? '' : '/' + fileName // prefix with folder (optional)

  if (filesConfig?.parent_output_directory) {
    if (fileDirectory) {
      return createFolderURL(filesConfig.parent_output_directory, fileDirectory) + fileNameWithPrefix
    }

    return createFolderURL(filesConfig.parent_output_directory) + fileNameWithPrefix
  }

  if (fileDirectory) {
    return createFolderURL(fileDirectory) + fileNameWithPrefix
  }
  
  return './' + fileNameWithPrefix
}

/**
 * @description     File-system
 */
const fs = require('fs')

/**
 * @description   Async function to check if a file exists or not
 *                No matter what, the promise WILL resolve to a boolean
 * @param filePath 
 * @return Promise<boolean>
 */
export const fileExist = (filePath: string): Promise<boolean> => 
  new Promise(resolve => {
    fs.access(filePath, fs.F_OK, (err: any) => {
      if (err) {
        // console.error(err)
        return resolve(false)
      }
      //file exists
      return resolve(true)
    })
  })
   
/**
 * @description   Simple method to delete a file, promise based (used in cleaning up files created during tests)
 * @param filePath 
 */  
export const deleteFile = (filePath: string): Promise<void> =>
  new Promise((resolve, reject) => {
    fs.unlink(filePath, function (err: any) {
      if (err) return reject(err)

      // if no error, file has been deleted successfully
      return resolve()
    })
  })