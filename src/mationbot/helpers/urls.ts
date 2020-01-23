
/**
 * @param folderNames list of folders to parse into a URL by adding a backslash to the end of each directory
 * @example    createURL('assets', 'screenshots') => 'assets/screenshots/'
 */
export const createURL = (...folderNames: string[]): string => 
  folderNames.reduce((folderUrl, folderName) => folderUrl + folderName + '/', '')