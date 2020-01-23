/**
 * @description   Provides helpful methods for parsing URL's and getting URL's to crawl (ie Instagram login URL)
 */

// Configure URL's without trailing backslashes (affixBackSlashes() function adds them in)
const INSTAGRAM_BASE_URL = 'https://www.instagram.com'
const INSTAGRAM_URL_EXT_LOGIN = 'accounts/login'

export const getInstagramBaseUrl = () =>
  createURL(INSTAGRAM_BASE_URL)

export const getInstagramLoginUrl = () => 
  createURL(INSTAGRAM_BASE_URL, INSTAGRAM_URL_EXT_LOGIN)

/**
 * @param folderNames list of folders to parse into a URL by adding a backslash to the end of each directory
 * @example    createURL('assets', 'screenshots') => 'assets/screenshots/'
 */
export const createURL = (...folderNames: string[]): string => 
  folderNames.reduce((folderUrl, folderName) => folderUrl + folderName + '/', '')