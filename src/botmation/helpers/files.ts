import { BotFileOptions } from "botmation/interfaces/bot-file-options"

/**
 * @description   Enrich provided BotFileOptions partial with safe default values
 *                BotFileOptions defaults set a zero directory structure on files created or read
 *                Read more in the comments of BotFileOptions
 * @param options 
 */
export const enrichBotFileOptionsWithDefaults = (options: Partial<BotFileOptions> = {}): BotFileOptions => ({
  screenshots_directory: '',
  pdfs_directory: '',
  cookies_directory: '',
  ...options
})

/**
 * @description   Creates a folder url based on the names passed in with a pattern of starting with `.` (local) followed by each folder name with a preceding `/`
 * @param folderNames spread array of folder names, can include file name at the end, given the pattern
 * @example    createURL('assets', 'screenshots') => './assets/screenshots'
 *             createUrl('assets', 'screenshots', 'example.png') => './assets/screenshots/example.png'
 */
export const createFolderURL = (...folderNames: string[]): string => 
  folderNames.reduce((folderUrl, folderName) => folderUrl + '/' + folderName, '.')

/**
 * @description   Builds a URL based on the requested file directory (an option in BotFileOptions), provided BotFileOptions and file name
 *                This follows the criteria of BotFileOptions so read more in that interface's comments
 *                When it comes to saving and reading files, this depends on the values of BotFileOptions in knowing where those files go/are
 * @param fileDirectory file directory name, can be empty string; expecting a BotFileOptions value
 * @param botFileOptions pass this in so we can handle the parent directory use-case
 * @param fileName 
 * @note          Seems more complicated than necessary. Up for improvement/standardization in the management of local files.
 */
export const getFileUrl = (fileDirectory: string, filesOptions: BotFileOptions, fileName: string = ''): string => {
  const fileNameWithPrefix = fileName === '' ? '' : '/' + fileName // prefix with folder (optional)

  if (filesOptions?.parent_output_directory) {
    if (fileDirectory) {
      return createFolderURL(filesOptions.parent_output_directory, fileDirectory) + fileNameWithPrefix
    }

    return createFolderURL(filesOptions.parent_output_directory) + fileNameWithPrefix
  }

  if (fileDirectory) {
    return createFolderURL(fileDirectory) + fileNameWithPrefix
  }
  
  return './' + fileNameWithPrefix
}
   